import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  Input,
  HostBinding,
} from '@angular/core';
import { MemberDto } from 'src/app/openapi/model/models';

@Component({
  selector: 'app-writer',
  templateUrl: './writer.component.html',
  styleUrls: ['./writer.component.scss'],
})
export class WriterComponent implements OnInit, OnChanges {
  text = '';

  @Input()
  member: MemberDto | null;

  @Output()
  send = new EventEmitter<string>();

  @Output()
  hidden = new EventEmitter<boolean>();

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    const mem = changes.member;
    if (
      mem &&
      this.canWrite(mem.currentValue) !== this.canWrite(mem.previousValue)
    ) {
      this.hidden.emit(this.isHidden);
    }
  }

  ngOnInit(): void {}

  enterKeydown(event: KeyboardEvent): void {
    if (!event.shiftKey && this.text) {
      event.preventDefault();
      this.submit();
    }
  }

  @HostBinding('class.hide')
  get isHidden(): boolean {
    return !this.member?.permission.write;
  }

  private canWrite(member: MemberDto): boolean {
    return member?.permission.write;
  }

  submit(): void {
    this.send.emit(this.text);
    this.text = '';
  }
}
