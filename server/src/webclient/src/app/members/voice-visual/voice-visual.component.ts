import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-voice-visual',
  templateUrl: './voice-visual.component.html',
  styleUrls: ['./voice-visual.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoiceVisualComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  voiceAnalyser: AnalyserNode | null = null;

  @Input()
  gain: GainNode | null = null;

  dataArray: Uint8Array;

  @ViewChild('wavecanvas')
  canvas: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.startDrawing();
  }

  startDrawing(): void {
    if (!this.canvas) {
      return;
    }
    const canvas = this.canvas.nativeElement;
    const canvasCtx = canvas.getContext('2d');

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;


    canvasCtx.fillStyle = 'rgb(255, 255, 255)';
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.fillStyle = 'rgb(56, 56, 56)';
    canvasCtx.strokeStyle = 'rgb(255, 255, 255)';

    const draw = () => {
      if (this.willStopDrawing()) {
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        return;
      }
      window.requestAnimationFrame(draw);

      this.voiceAnalyser.getByteTimeDomainData(this.dataArray);
      const bufferLength = this.dataArray.length;

      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;

      canvasCtx.beginPath();

      const sliceWidth = (WIDTH * 1.0) / bufferLength;

      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = this.dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.voiceAnalyser) {
      if (this.voiceAnalyser !== null) {
        this.voiceAnalyser.fftSize = 2048;
        this.dataArray = new Uint8Array(this.voiceAnalyser.fftSize);
        this.startDrawing();
      }
    }
  }

  willStopDrawing(): boolean {
    return this.voiceAnalyser === null;
  }
}
