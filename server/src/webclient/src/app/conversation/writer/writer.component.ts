import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-writer',
  templateUrl: './writer.component.html',
  styleUrls: ['./writer.component.scss']
})
export class WriterComponent implements OnInit {

  text = '';

  @Output()
  send = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  keyup(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      if (event.key === 'Enter') {
        this.submit();
        event.preventDefault();
      }
    }

  }


  submit(): void {
    this.send.emit(this.text);
    this.text = '';
  }


}
