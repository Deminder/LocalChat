import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChildren,
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
import {AuthorColorPipe} from 'src/app/shared/author-color.pipe';

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
export class MessageListComponent implements OnChanges, AfterViewChecked {
  @Input()
  messages: ConversationMessageDto[] = [];

  @Input()
  showSpinner = false;

  @Input()
  selfUserId = -1;

  @Input()
  memberDict: Dictionary<MemberDto> = {};

  /* highlighted message id */
  @Input()
  highlight = -1;

  searchMatcher: RegExp | null = null;
  messageSearch: boolean[] = [];

  @Input()
  set search(s: MessageSearch | null) {
    if (s !== null && s.search !== '') {
      this.searchMatcher = new RegExp(
        s.regex ? s.search : escapeRegExp(s.search),
        'i'
      );
    } else {
      this.searchMatcher = null;
    }
  }

  @ViewChildren('message')
  messageElements!: QueryList<ElementRef>;

  @Output()
  delete = new EventEmitter<ConversationMessageDto>();

  @Output()
  edit = new EventEmitter<ConversationMessageDto>();

  @Output()
  searchTopOffsets = new EventEmitter<{ [msgId: number]: number }>();

  @Output()
  searchSize = new EventEmitter<number>();

  @Output()
  lengthUpdate = new EventEmitter<[boolean, number]>();

  selected = -1;

  get heightFingerprint(): [boolean, number] {
    return [this.selected >= 0, this.messages.length];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['showSpinner'] ||
      (changes['messages'] &&
        changes['messages'].previousValue?.length !==
          changes['messages'].currentValue.length)
    ) {
      this.lengthUpdate.emit(this.heightFingerprint);
    }
    const sRegex = this.searchMatcher;
    if (sRegex !== null && (changes['messages'] || changes['search'])) {
      this.messageSearch = this.messages.map((msg) => sRegex.test(msg.text));
      this.searchSize.emit(this.messageSearch.filter((v) => v).length);
    }
  }

  ngAfterViewChecked(): void {
    this.searchTopOffsets.emit(
      Object.fromEntries(
        this.messageElements
          .map(
            (element, i) =>
              [this.messageSearch[i], this.messages[i].id, element] as [
                boolean,
                number,
                ElementRef<any>
              ]
          )
          .filter(([isMatch]) => isMatch)
          .map(([_, msgId, ele]) => [msgId, ele.nativeElement.offsetTop])
      )
    );
  }

  messageClasses(msg: ConversationMessageDto, index: number): string[] {
    const colorPipe = new AuthorColorPipe();
    return [
      'chatmessage',
      this.selfUserId === msg.authorUserId ? 'outgoing' : 'incoming',
      'msg-color-' + (1 + (colorPipe.transform(msg.authorUserId, this.memberDict)))
    ].concat(
      !this.searchMatcher || this.messageSearch[index] ? [] : ['nomatch']
    );
  }

  editPermission(userId: number): boolean {
    return userId === this.selfUserId;
  }

  deletePermission(userId: number): boolean {
    return (
      userId === this.selfUserId ||
      (this.memberDict[this.selfUserId]?.permission.moderate ?? false)
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

  /**
   * Luminance of hex color 0-255
   */
  luminance(h: string): number {
    let l = 0;
    // 6 digits
    if (h.length === 7) {
      const r = Number('0x' + h[1] + h[2]);
      const g = Number('0x' + h[3] + h[4]);
      const b = Number('0x' + h[5] + h[6]);
      const cmin = Math.min(r, g, b);
      const cmax = Math.max(r, g, b);
      l = (cmin + cmax) / 2;
    } else {
      l = 0;
    }
    return l;
  }
}
