import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import {
  ConversationMessageDto,
  MemberDto,
} from 'src/app/openapi/model/models';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, OnChanges {
  @Input()
  messages: ConversationMessageDto[];

  @Input()
  showSpinner: boolean;

  @Input()
  selfUserId: number;

  @Input()
  memberDict: Dictionary<MemberDto>;

  @Input()
  scrollDown: boolean;

  @Output()
  delete = new EventEmitter<{ messageId: number }>();

  @Output()
  edit = new EventEmitter<{ messageId: number }>();

  @Output()
  atTop = new EventEmitter<void>();

  selected = -1;

  constructor() {}

  ngOnChanges(): void {}

  ngOnInit(): void {}

  isOutgoing(msg: ConversationMessageDto): boolean {
    return this.selfUserId === msg.authorUserId;
  }

  messageClasses(msg: ConversationMessageDto): string[] {
    return ['chatmessage', this.isOutgoing(msg) ? 'outgoing' : 'incoming'];
  }

  editPermission(userId: number): boolean {
    return userId === this.selfUserId;
  }

  deletePermission(userId: number): boolean {
    return (
      userId === this.selfUserId ||
      this.memberDict[this.selfUserId].permission.moderate
    );
  }
}
