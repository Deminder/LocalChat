import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-writer',
  templateUrl: './writer.component.html',
  styleUrls: ['./writer.component.scss'],
})
export class WriterComponent implements OnInit {
  text = '';

  @Output()
  send = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  keydown(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.submit();
      }
    }
  }

  submit(): void {
    this.send.emit(this.text);
    this.text = '';
  }
}
