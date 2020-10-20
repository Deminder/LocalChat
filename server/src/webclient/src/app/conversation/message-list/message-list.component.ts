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
import { interval, of, Subscription } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
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

  shownMessageIds = new Set<number>();

  newMessageQueue: number[] = [];

  shownMessages: ConversationMessageDto[] = [];

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
  atTop = new EventEmitter<boolean>();

  updater: Subscription;

  selected = -1;

  constructor() {}
  ngOnDestroy(): void {
    this.updater.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.messages !== undefined) {
      const msgIds = this.messages.map((msg) => msg.id);
      const msgIdSet = new Set(msgIds);
      // missing messages are deleted instantly
      this.shownMessageIds = new Set(
        [...this.shownMessageIds].filter((msgId) => msgIdSet.has(msgId))
      );
      this.updateShownMessages();
      // add one-by-one
      this.newMessageQueue = this.newMessageQueue.concat(
        ...this.shortestShownMessageDistance(
          msgIds.filter((msgId) => !this.shownMessageIds.has(msgId))
        ).map(([mid]) => Number(mid))
      );
    }
  }

  ngOnInit(): void {
    this.updater = interval(20)
      .pipe(
        filter(() => this.newMessageQueue.length > 0),
        map(() => this.newMessageQueue.pop())
      )
      .subscribe((i) => {
        this.shownMessageIds.add(i);
        this.updateShownMessages();
      });
  }

  private shortestShownMessageDistance(msgIds: number[]): [number, number][] {
    const ids = new Set(msgIds);
    // forward distance
    const fres = this.shownMessageDistance(ids, false);
    // backward distance
    const bres = this.shownMessageDistance(ids, false);
    const res = Object.entries(fres).map(
      ([mid, dist]) =>
        [Number(mid), Math.min(bres[mid], dist)] as [number, number]
    );
    res.sort(([_, dist], [__, dist2]) => dist - dist2);
    return res;
  }

  private shownMessageDistance(
    ids: Set<number>,
    reverse: boolean
  ): { [msgId: number]: number } {
    const res = {};
    let dist = 0;
    const messages = Array.from(this.messages);
    if (reverse) {
      messages.reverse();
    }
    for (const msg of messages) {
      if (ids.has(msg.id)) {
        res[msg.id] = dist;
      }
      dist = this.shownMessageIds.has(msg.id) ? 0 : dist + 1;
    }
    return res;
  }

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

  updateShownMessages(): void {
    this.shownMessages = this.messages.filter((msg) =>
      this.shownMessageIds.has(msg.id)
    );
  }
}
