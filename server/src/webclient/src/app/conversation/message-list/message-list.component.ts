import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
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
export class MessageListComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  messages: ConversationMessageDto[];

  @Input()
  showSpinner: boolean;

  @Input()
  selfUserId: number;

  @Input()
  memberDict: Dictionary<MemberDto>;

  @Output()
  delete = new EventEmitter<{ messageId: number }>();

  @Output()
  edit = new EventEmitter<{ messageId: number }>();

  @Output()
  lengthUpdate = new EventEmitter<any>();

  selected = -1;

  get heightFingerprint(): [boolean, number] {
    return [this.selected >= 0, this.messages.length];
  }

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.showSpinner || (
      changes.messages &&
      changes.messages.previousValue?.length !==
        changes.messages.currentValue.length )
    ) {
      this.lengthUpdate.emit(this.heightFingerprint);
    }
  }
  ngOnDestroy(): void {}

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

  selectMessage(msgId: number): void {
    if (this.selected !== msgId) {
      this.selected = msgId;
    } else {
      this.selected = -1;
    }
    this.lengthUpdate.emit(this.heightFingerprint);
  }
}
