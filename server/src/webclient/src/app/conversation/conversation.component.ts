import { CdkScrollable } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { animationFrameScheduler, Subscription } from 'rxjs';
import {
  auditTime,
  distinctUntilChanged,
  filter,
  map,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { ConversationMessageDto } from '../openapi/model/models';
import {
  createMessage,
  deleteMessage,
  editMessage,
  startLoadMoreMessages,
  stopLoadMoreMessages,
  changeMessageSearchCount,
} from '../store/actions/conversation.actions';
import { selectedConversationId } from '../store/reducers/router.reducer';
import {
  isFirstPage,
  isLastPage,
  isLoadingMoreMessages,
  selectConversationMemberEntities,
  selectConversationMessages,
  selectNewestMessage,
  selectSelfMember,
  selectMessageSearch,
  selectMessageSearchIndex,
} from '../store/selectors/conversation.selectors';
import { selectSelfUserId } from '../store/selectors/user.selectors';
import { MessageListComponent } from './message-list/message-list.component';
import { ExtendedScrollToOptions } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  conversationId$ = this.store.select(selectedConversationId);
  selfUserId$ = this.store.select(selectSelfUserId);
  conversationMessages$ = this.store.select(selectConversationMessages);
  memberEntites$ = this.store.select(selectConversationMemberEntities);
  isFirstPage$ = this.store.select(isFirstPage);
  isLastPage$ = this.store.select(isLastPage);
  selfMember$ = this.store.select(selectSelfMember);
  loadingMoreMessages$ = this.store.select(isLoadingMoreMessages);
  newestConversationMessage$ = this.store.select(selectNewestMessage);
  messageSearch$ = this.store.select(selectMessageSearch);
  messageSearchIndex$ = this.store.select(selectMessageSearchIndex);

  @ViewChild(MessageListComponent)
  messageList: MessageListComponent;

  @ViewChild(CdkScrollable)
  messageScrollable: CdkScrollable;

  downScroller: Subscription;
  scrollToLowestMsgIds = -1;
  keepPreviousScrollPosition = false;
  firstPage = false;
  searchTopOffsets: { [msgId: number]: number } = {};

  updater: Subscription;

  searchHighlight = -1;
  searchJumper: Subscription;

  constructor(private store: Store, private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.downScroller = this.newestConversationMessage$
      .pipe(
        filter((msg) => msg !== null),
        map((msg) => msg.id),
        distinctUntilChanged(),
        withLatestFrom(this.isFirstPage$)
      )
      .subscribe(([msgId, firstPage]) => {
        this.scrollToLowestMsgIds = msgId;
        this.firstPage = firstPage;
      });

    this.updater = this.messageScrollable
      .elementScrolled()
      .pipe(
        auditTime(200, animationFrameScheduler),
        map(
          () =>
            this.messageScrollable.measureScrollOffset('top') <
            1.5 *
              this.messageScrollable.getElementRef().nativeElement.clientHeight
        ),
        distinctUntilChanged()
      )
      .subscribe((high) => {
        this.ngZone.run(() => {
          this.conversationId$
            .pipe(take(1))
            .subscribe((cid) => this.loadMoreMessages(cid, high));
        });
      });
    this.searchJumper = this.messageSearchIndex$
      .pipe(distinctUntilChanged())
      .subscribe((index) => {
        const ids = Object.keys(this.searchTopOffsets);
        const msgId = index >= 0 ? Number(ids[ids.length - 1 - index]) : -1;
        this.searchHighlight = msgId;
        this.doScrollTo({
          top: this.searchTopOffsets[msgId],
        });
      });
  }

  keepScrollRelativeToBottom(): void {
    // measure size before view updates
    const scrollBottomTarget =
      this.messageScrollable?.measureScrollOffset('bottom') ?? 0;
    this.keepPreviousScrollPosition = true;
    // scrolls right after change detection is done
    this.ngZone.runOutsideAngular(() => {
      animationFrameScheduler.schedule(() => {
        if (this.keepPreviousScrollPosition) {
          this.messageScrollable.scrollTo({ bottom: scrollBottomTarget });
        }
      });
    });
  }

  doScrollTo(options: ExtendedScrollToOptions): void {
    this.ngZone.runOutsideAngular(() => {
      animationFrameScheduler.schedule(() => {
        this.messageScrollable.scrollTo(options);
        this.keepPreviousScrollPosition = false;
      });
    });
  }

  ngAfterViewChecked(): void {
    // scrolls to last index if messageList is showing last id
    const msgs = this.messageList.messages;
    if (
      this.scrollToLowestMsgIds >= 0 &&
      msgs.length >= 0 &&
      this.scrollToLowestMsgIds === msgs[msgs.length - 1].id
    ) {
      this.scrollToLowestMsgIds = -1;
      this.doScrollTo({
        bottom: 0,
        behavior: this.firstPage ? 'auto' : 'smooth',
      });
    }
  }

  ngOnDestroy(): void {
    this.downScroller.unsubscribe();
    this.updater.unsubscribe();
  }

  loadMoreMessages(conversationId: number, loadMore: boolean): void {
    if (loadMore) {
      this.store.dispatch(startLoadMoreMessages({ conversationId }));
    } else {
      this.store.dispatch(stopLoadMoreMessages());
    }
  }

  deleteMessage(conversationId: number, msg: ConversationMessageDto): void {
    // TODO open confirm popup
    this.store.dispatch(deleteMessage({ conversationId, messageId: msg.id }));
  }

  editMessage(conversationId: number, msg: ConversationMessageDto): void {
    // TODO edit dialog
    this.store.dispatch(
      editMessage({
        conversationId,
        messageId: msg.id,
        text: msg.text + ' Edited text!',
      })
    );
  }

  sendMessage(conversationId: number, text: string): void {
    this.store.dispatch(createMessage({ conversationId, text }));
  }

  updateSearchTopOffsets(offsets: { [msgId: number]: number }): void {
    this.searchTopOffsets = offsets;
  }

  updateSearchSize(size: number): void {
    setTimeout(() => {
      this.store.dispatch(changeMessageSearchCount({ total: size }));
    });
  }
}
