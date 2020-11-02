function copyBuffer(source, dest, len, sourceOffset, destOffset) {
  for (let l = 0; l < len; l++) {
    dest[l + destOffset] = source[l + sourceOffset];
  }
}
class VoiceProcessor extends AudioWorkletProcessor {
  // Static getter to define AudioParam objects in this custom processor.
  static get parameterDescriptors() {
    return [
      {
        name: "samplesPerFrame",
        defaultValue: 128,
      },
    ];
  }

  constructor() {
    super();
    this.nextFloatBufferFrame = new Float32Array(128);
    this.sampleOffset = 0;
    this.wasAlive = false;
    this.port.onmessage = (event) => {
      console.log(event.data);
    };
  }

  /* AudioWorkletProcessor.process() method */
  process(inputs, _, parameters) {
    // The processor may have multiple inputs and outputs. Get the first input and
    // output.
    const input = inputs[0];
    //const output = outputs[0];

    // Each input or output may have multiple channels. Get the first channel.
    const inputChannel0 = input[0];
    //const outputChannel0 = output[0];

    if (!inputChannel0) {
      // shutdown once input is disconnected
      return !this.wasAlive;
    }
    this.wasAlive = true;

    if (this.nextFloatBufferFrame.length !== parameters.samplesPerFrame[0]) {
      // always use correct frame size
      this.nextFloatBufferFrame = new Float32Array(
        parameters.samplesPerFrame[0]
      );
      this.sampleOffset = 0;
    }

    let inputOffset = 0;
    while (inputOffset < inputChannel0.length) {
      const inputLength = inputChannel0.length - inputOffset;
      let copyLength = inputLength;
      if (this.sampleOffset + inputLength > this.nextFloatBufferFrame.length) {
        // input does not fit in current frame
        copyLength = this.nextFloatBufferFrame.length - this.sampleOffset;
      }
      copyBuffer(
        inputChannel0,
        this.nextFloatBufferFrame,
        copyLength,
        inputOffset,
        this.sampleOffset
      );
      inputOffset += copyLength;
      this.sampleOffset += copyLength;

      if (this.sampleOffset === this.nextFloatBufferFrame.length) {
        // frame is full
        this.port.postMessage(this.nextFloatBufferFrame.slice(0));
        // reset buffer
        this.sampleOffset = 0;
      }
    }

    // Keep processor alive
    return true;
  }
}

registerProcessor("voice-processor", VoiceProcessor);
