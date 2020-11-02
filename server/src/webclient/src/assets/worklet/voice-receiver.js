function copyBuffer(source, dest, len, sourceOffset, destOffset) {
  for (let l = 0; l < len; l++) {
    dest[l + destOffset] = source[l + sourceOffset];
  }
}

function downSampleAndShrink(source, factor) {
  const destLength = Math.round(source.length / factor);
  if (destLength >= source.length) {
    return source;
  }
  // bilinear interpolation between samples
  const dest = new Float32Array(destLength);
  for (let destIndex = 0; destIndex < destLength; destIndex++) {
    const pos = destIndex * factor;
    const sourceIndex0 = Math.floor(pos);
    const source0 = source[sourceIndex0];
    const sourceIndex1 = sourceIndex0 + 1;
    if (sourceIndex1 < source.length) {
      const source1 = source[sourceIndex1];
      const alpha = pos - sourceIndex0;
      dest[destIndex] = (1 - alpha) * source0 + alpha * source1;
    } else {
      dest[destIndex] = source0;
    }
  }
  return dest;
}

class VoiceProcessor extends AudioWorkletProcessor {
  // Static getter to define AudioParam objects in this custom processor.
  static get parameterDescriptors() {
    return [
      {
        name: "delay",
        defaultValue: 0.05, // 50ms
      },
      {
        name: "maxDelay",
        defaultValue: 0.8, // 800ms
      },
      {
        name: "maxSpeedup",
        defaultValue: 2, // 2x normal playback speed
        minValue: 1,
        maxValue: 4,
      },
    ];
  }

  constructor() {
    super();
    this.inactiveFrames = 0;
    this.playbackDelaySamples = 0;
    this.pendingFrames = [];
    this.sampleOffset = 0;
    this.delay = 0.05;
    this.maxDelay = 0.8;
    this.maxSpeedup = 2;
    this.wasAlive = false;
    this.port.onmessage = (event) => {
      const delaySamples = Math.floor(this.delay * sampleRate);
      const maxDelaySamples = Math.floor(this.maxDelay * sampleRate);
      const pendingSamples = this.pendingFrames.reduce(
        (len, a) => len + a.length,
        0
      );

      const extraSamples = pendingSamples - delaySamples;
      let frame = event.data;
      if (extraSamples > 0) {
        const targetSpeedUp = Math.exp(
          Math.log(this.maxSpeedup) *
            Math.pow(extraSamples / (maxDelaySamples - delaySamples), 2)
        );
        if (targetSpeedUp > this.maxSpeedup) {
          console.log(
            "WARN: skipping " + this.pendingFrames.length + " audio frames"
          );
          // skip some frames
          this.pendingFrames = [];
          this.sampleOffset = 0;
          this.playbackDelaySamples = 0;
        } else {
          // shrink future frame
          frame = downSampleAndShrink(frame, targetSpeedUp);
          //console.log(this.pendingFrames.length);
          //console.log(
          //targetSpeedUp,
          //extraSamples,
          //maxDelaySamples - delaySamples,
          //frame.length
          //);
        }
      }
      this.pendingFrames.push(frame);
    };
  }

  /* AudioWorkletProcessor.process() method */
  process(_, outputs, parameters) {
    // The processor may have multiple inputs and outputs. Get the first input and
    // output.
    //const input = inputs[0];
    const output = outputs[0];

    // Each input or output may have multiple channels. Get the first channel.
    //const inputChannel0 = input[0];
    const outputChannel0 = output[0];

    if (!outputChannel0) {
      // shutdown once output is disconnected
      return !this.wasAlive;
    }
    this.wasAlive = true;

    this.delay = parameters.delay[0];
    this.maxDelay = parameters.maxDelay[0];
    this.maxSpeedup = parameters.maxSpeedup[0];

    if (this.pendingFrames.length === 0) {
      // nothing to write (delay future frame)
      this.playbackDelaySamples = Math.floor(this.delay * sampleRate);
      return true;
    }

    if (this.playbackDelaySamples >= outputChannel0.length) {
      // delay pending frames for some samples
      this.playbackDelaySamples -= outputChannel0.length;
      return true;
    }
    // start writing pending frames
    let outputOffset = this.playbackDelaySamples;
    this.playbackDelaySamples = 0;
    while (outputOffset < outputChannel0.length) {
      const curFrame = this.pendingFrames[0];
      const frameLength = curFrame.length;
      const sourceSize = frameLength - this.sampleOffset;
      const destSize = outputChannel0.length - outputOffset;

      const copyLength = Math.min(destSize, sourceSize);

      copyBuffer(
        curFrame,
        outputChannel0,
        copyLength,
        this.sampleOffset,
        outputOffset
      );

      this.sampleOffset += copyLength;
      outputOffset += copyLength;

      if (this.sampleOffset === frameLength) {
        // next frame
        this.pendingFrames.splice(0, 1);
        this.sampleOffset = 0;
      }

      if (this.pendingFrames.length === 0) {
        this.playbackDelaySamples = Math.floor(this.delay * sampleRate);
        break;
      }
    }

    // Keep processor alive
    return true;
  }
}

registerProcessor("voice-receiver", VoiceProcessor);
