import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { VoiceBuffer } from './voicebuffer';
import { Store } from '@ngrx/store';
import {
  switchVoiceConversation,
  enableMicrophone,
} from 'src/app/store/actions/conversation.actions';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  endpoint = '/api/voice';

  micAudioContext: AudioContext;
  playBackAudioContext: AudioContext;

  samplesPerFrame = 512;
  silentFrameGap = 0;
  silencePowerThreshold = 0; // TODO let user give threshold 0.00004;

  voiceAnalysers: { [username: string]: AnalyserNode } = {};
  voiceAnalysers$ = new Subject<{ [username: string]: AnalyserNode }>();
  gains: { [username: string]: GainNode } = {};
  gains$ = new Subject<{ [username: string]: GainNode }>();

  selfVoiceAnalyser$ = new Subject<AnalyserNode | null>();
  selfGain$ = new Subject<GainNode | null>();

  constructor(private ngZone: NgZone, private store: Store) {}

  private static signalPower(frame: Float32Array): number {
    return frame.reduce((sum, v) => sum + v * v, 0) / frame.length;
  }

  private async initContext(moduleURL: string): Promise<AudioContext> {
    const audioContext = new AudioContext();
    if (window.isSecureContext) {
      await audioContext.audioWorklet.addModule(moduleURL);
    } else {
      throw new Error(
        'Audio Worklet only available in secure context! (HTTPS required!)'
      );
    }
    return audioContext;
  }

  async initMicContext(): Promise<AudioContext> {
    if (!this.micAudioContext) {
      this.micAudioContext = await this.initContext(
        'assets/worklet/voice-processor.js'
      );
    } else {
      this.micAudioContext.resume();
    }

    return this.micAudioContext;
  }

  async initPlaybackContext(): Promise<AudioContext> {
    if (!this.playBackAudioContext) {
      this.playBackAudioContext = await this.initContext(
        'assets/worklet/voice-receiver.js'
      );
    } else {
      this.playBackAudioContext.resume();
    }
    return this.playBackAudioContext;
  }

  /* JOIN CHANNEL */

  wsCleanup: () => Promise<void> = () => Promise.resolve();
  sendVoiceFrame: (data: Float32Array) => void = () => null;

  join(conversationId: number): void {
    this.ngZone.runOutsideAngular(async () => {
      await this.leave();

      if (conversationId > 0) {
        const p = location.protocol === 'http:' ? 'ws:' : 'wss:';
        const ws = new WebSocket(
          `${p}//${location.host}${this.endpoint}?cid=${conversationId}`
        );

        ws.onopen = () => {
          console.log('ws open!!');
        };

        ws.onmessage = (ev) => {
          VoiceBuffer.fromBlob(ev.data, conversationId)
            .then((buffer) => this.receiveVoiceBuffer(buffer))
            .catch((error) => {
              console.error(error);
              this.leave();
            });
        };

        this.sendVoiceFrame = (data: Float32Array) => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(data);
          }
        };

        ws.onclose = (event) => {
          if (event.code === 1008) {
            // server session expired
            setTimeout(() => {
              this.join(conversationId);
            }, 100);
            console.log(
              'Restarting websocket after session expired.',
              event.reason,
              event.code
            );
          } else {
            console.log('WebSocket closed.', event.reason, event.code);
            this.ngZone.run(() =>
              this.store.dispatch(
                switchVoiceConversation({ conversationId: -1 })
              )
            );
          }
        };

        this.wsCleanup = () => {
          this.sendVoiceFrame = () => null;
          if (ws.readyState !== WebSocket.CLOSED) {
            ws.close();
          }
          return Promise.resolve();
        };
      }
    });
  }

  private async leave(): Promise<void> {
    await this.wsCleanup();
    this.wsCleanup = () => Promise.resolve();
  }

  private receiveVoiceBuffer(voiceBuffer: VoiceBuffer): void {
    if (voiceBuffer.frame.length) {
      this.playNextFrame(voiceBuffer.userName, voiceBuffer.frame);
    }
  }

  /* PLAYBACK */

  playNextFrame: (username: string, frame: Float32Array) => void = () => null;
  playContextCleanup: () => Promise<void> = () => Promise.resolve();

  enablePlayback(enabled: boolean): void {
    this.ngZone.runOutsideAngular(async () => {
      await this.disablePlayback();

      if (enabled) {
        const audioContext = await this.initPlaybackContext();

        const receivers: { [name: string]: AudioWorkletNode } = {};

        const getReceiver = (username: string) => {
          if (!(username in receivers)) {
            const constant = audioContext.createConstantSource();
            const receiver = new AudioWorkletNode(
              audioContext,
              'voice-receiver'
            );
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.7, audioContext.currentTime);
            const analyser = audioContext.createAnalyser();
            constant
              .connect(receiver)
              .connect(gain)
              .connect(analyser)
              .connect(audioContext.destination);

            receivers[username] = receiver;

            // notify about node change
            this.voiceAnalysers[username] = analyser;
            this.gains[username] = gain;
            this.ngZone.run(() => {
              this.gains$.next(this.gains);
              this.voiceAnalysers$.next(this.voiceAnalysers);
            });
          }
          return receivers[username];
        };

        this.playNextFrame = (username: string, frame: Float32Array) => {
          getReceiver(username).port.postMessage(frame);
        };
        this.playContextCleanup = () => {
          Object.values(receivers).forEach((r) => r.disconnect());
          this.playNextFrame = () => null;
          this.gains = {};
          this.voiceAnalysers = {};
          this.ngZone.run(() => {
            this.gains$.next(this.gains);
            this.voiceAnalysers$.next(this.voiceAnalysers);
          });
          return audioContext.suspend();
        };
      }
    });
  }

  private async disablePlayback(): Promise<void> {
    await this.playContextCleanup();
    this.playContextCleanup = () => Promise.resolve();
  }

  /* MICROPHONE */
  micContextCleanup: () => Promise<void> = () => Promise.resolve();

  enableMic(enabled: boolean): void {
    this.ngZone.runOutsideAngular(async () => {
      // clean previous context
      await this.disableMic();

      if (enabled) {
        // start new microphone session if enabled
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
        } catch (e) {
          console.log('No microphone available!', e);
          this.ngZone.run(() =>
            this.store.dispatch(enableMicrophone({ enabled: false }))
          );
          return;
        }
        const tracks = stream.getAudioTracks();
        tracks.forEach((t) => (t.enabled = true));

        const audioContext = await this.initMicContext();
        const sendingNode = await this.voiceSendingNode(audioContext);

        const lowPass = audioContext.createBiquadFilter();
        lowPass.type = 'lowpass';
        lowPass.frequency.setValueAtTime(5000, audioContext.currentTime);
        lowPass.Q.setValueAtTime(0.5, audioContext.currentTime);

        const highPass = audioContext.createBiquadFilter();
        highPass.type = 'highpass';
        highPass.frequency.setValueAtTime(300, audioContext.currentTime);
        highPass.Q.setValueAtTime(0.5, audioContext.currentTime);

        //distortion = audioContext.createWaveShaper();
        //distortion.oversample = '4x';
        //distortion.curve = makeDistortionCurve(400);

        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0.7, audioContext.currentTime);
        const analyser = audioContext.createAnalyser();

        this.ngZone.run(() => {
          this.selfGain$.next(gain);
          this.selfVoiceAnalyser$.next(analyser);
        });

        const sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode
          .connect(lowPass)
          .connect(highPass)
          .connect(gain)
          .connect(analyser)
          .connect(sendingNode)
          .connect(audioContext.destination);

        this.micContextCleanup = () => {
          sourceNode.disconnect();
          // tell sending Node to disconnect:
          analyser.disconnect();
          tracks.forEach((t) => t.stop());
          this.ngZone.run(() => {
            this.selfGain$.next(null);
            this.selfVoiceAnalyser$.next(null);
          });
          return audioContext.suspend();
        };
      }
    });
  }

  private async disableMic(): Promise<void> {
    await this.micContextCleanup();
    this.micContextCleanup = () => Promise.resolve();
  }

  private async voiceSendingNode(
    audioContext: AudioContext
  ): Promise<AudioWorkletNode> {
    const node = new AudioWorkletNode(audioContext, 'voice-processor');
    const param: AudioParam = (node.parameters as any).get('samplesPerFrame');
    param.setValueAtTime(this.samplesPerFrame, audioContext.currentTime);

    let previousFrame: Float32Array = null;
    node.port.onmessage = (event) => {
      // Handling data from the processor.
      const frame = event.data;
      // check if frame is silent (should not send silent frames)
      if (VoiceService.signalPower(frame) < this.silencePowerThreshold) {
        this.silentFrameGap++;
      } else {
        // silent -> active : send previous silent frame
        if (this.silentFrameGap > 0) {
          this.sendVoiceFrame(previousFrame);
        }
        this.silentFrameGap = 0;
      }
      // active => silent : stop sending
      if (this.silentFrameGap <= 20) {
        this.sendVoiceFrame(frame);
      }
      //this.playNextFrame('self', frame);
      previousFrame = frame;
    };
    return node;
  }
}
