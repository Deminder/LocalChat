import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChildren,
  Query,
  QueryList,
  AfterViewChecked,
  ElementRef,
} from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import {
  ConversationMessageDto,
  MemberDto,
} from 'src/app/openapi/model/models';
import { MessageSearch } from 'src/app/store/reducers/conversation.reducer';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

function escapeRegExp(value: string): string {
  return value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

@Component({
  selector: 'app-message-list',
  animations: [
    trigger('highlight', [
      state('active', style({ opacity: 1 })),
      transition('* => active', [style({ opacity: 0 }), animate('800ms')]),
    ]),
  ],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
  @Input()
  messages: ConversationMessageDto[];

  @Input()
  showSpinner: boolean;

  @Input()
  selfUserId: number;

  @Input()
  memberDict: Dictionary<MemberDto>;

  /* highlighted message id */
  @Input()
  highlight: number;

  searchMatcher: RegExp | null;
  searchResult: { [msgId: number]: boolean } = {};

  @Input()
  set search(s: MessageSearch) {
    if (s.search !== '') {
      this.searchMatcher = new RegExp(
        s.regex ? s.search : escapeRegExp(s.search),
        'i'
      );
    } else {
      this.searchMatcher = null;
    }
  }

  @ViewChildren('message')
  messageElements: QueryList<ElementRef>;

  @Output()
  delete = new EventEmitter<{ messageId: number }>();

  @Output()
  edit = new EventEmitter<{ messageId: number }>();

  @Output()
  searchTopOffsets = new EventEmitter<{ [msgId: number]: number }>();

  @Output()
  searchSize = new EventEmitter<number>();

  @Output()
  lengthUpdate = new EventEmitter<any>();

  selected = -1;

  get heightFingerprint(): [boolean, number] {
    return [this.selected >= 0, this.messages.length];
  }

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.showSpinner ||
      (changes.messages &&
        changes.messages.previousValue?.length !==
          changes.messages.currentValue.length)
    ) {
      this.lengthUpdate.emit(this.heightFingerprint);
    }
    if (this.searchMatcher && (changes.messages || changes.search)) {
      this.searchResult = this.messages.reduce((res, msg) => {
        res[msg.id] = this.searchMatcher.test(msg.text);
        return res;
      }, {});
      this.searchSize.emit(
        Object.values(this.searchResult).filter((v) => v).length
      );
    }
  }

  ngAfterViewChecked(): void {
    this.searchTopOffsets.emit(
      this.messageElements.reduce((offsets, ele, i) => {
        const msgId = Object.keys(this.searchResult)[i];
        if (this.searchResult[msgId]) {
          offsets[msgId] = ele.nativeElement.offsetTop;
        }
        return offsets;
      }, {})
    );
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {}

  isOutgoing(msg: ConversationMessageDto): boolean {
    return this.selfUserId === msg.authorUserId;
  }

  messageClasses(msg: ConversationMessageDto): string[] {
    return [
      'chatmessage',
      this.isOutgoing(msg) ? 'outgoing' : 'incoming',
    ].concat(
      !this.searchMatcher || this.searchResult[msg.id] ? [] : ['nomatch']
    );
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
