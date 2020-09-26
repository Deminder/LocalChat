import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  ConversationMessageDto,
  MemberDto,
} from 'src/app/openapi/model/models';
import { Dictionary } from '@ngrx/entity';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {
  @Input()
  messages: ConversationMessageDto[];

  @Input()
  selfUserId: number;

  selected = -1;

  @Input()
  memberDict: Dictionary<MemberDto>;

  @Output()
  delete = new EventEmitter<{ messageId: number }>();

  @Output()
  edit = new EventEmitter<{ messageId: number }>();

  constructor() {}

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
    return userId === this.selfUserId || this.memberDict[this.selfUserId].permission.moderate;
  }
}
