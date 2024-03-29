import * as overlay from '@angular/cdk/overlay';
import { ExtendedScrollToOptions } from '@angular/cdk/scrolling';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { animationFrameScheduler, combineLatest, Subscription } from 'rxjs';
import {
  auditTime,
  distinctUntilChanged,
  filter,
  map,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { ConversationMessageDto } from '../openapi/model/models';
import { EditMessageComponent } from '../shared/dialogs/edit-message/edit-message.component';
import { NotifyService } from '../shared/services/notify.service';
import {
  changeMessageSearchCount,
  createMessage,
  deleteMessage,
  editMessage,
  selfReadMessage,
  startLoadMoreMessages,
  stopLoadMoreMessages,
} from '../store/actions/conversation.actions';
import { selectedConversationId } from '../store/reducers/router.reducer';
import {
  isFirstPage,
  isLastPage,
  isLoadingMoreMessages,
  selectConversationMemberEntities,
  selectConversationMessages,
  selectMessageSearch,
  selectMessageSearchIndex,
  selectNewestMessage,
  selectSelfMember,
} from '../store/selectors/conversation.selectors';
import { selectSelfUserId } from '../store/selectors/user.selectors';
import { MessageListComponent } from './message-list/message-list.component';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent
  implements OnDestroy, AfterViewInit, AfterViewChecked {
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

  newMessageId$ = this.newestConversationMessage$.pipe(
    map((msg) => msg?.id ?? -1),
    filter((id) => id > 0),
    distinctUntilChanged()
  );

  @ViewChild(MessageListComponent)
  messageList!: MessageListComponent;

  @ViewChild(overlay.CdkScrollable)
  messageScrollable!: overlay.CdkScrollable;

  downScroller!: Subscription;
  scrollToLowestMsgIds = -1;
  keepPreviousScrollPosition = false;
  firstPage = false;
  searchTopOffsets: { [msgId: number]: number } = {};

  updater!: Subscription;

  searchHighlight = -1;
  searchJumper!: Subscription;

  readInformer!: Subscription;

  constructor(
    private store: Store,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private notifyService: NotifyService
  ) {}

  ngAfterViewInit(): void {
    this.downScroller = this.newMessageId$
      .pipe(withLatestFrom(this.isFirstPage$))
      .subscribe(([msgId, firstPage]) => {
        this.scrollToLowestMsgIds = msgId;
        this.firstPage = firstPage ?? false;
      });

    this.readInformer = combineLatest([
      this.newMessageId$,
      this.notifyService.hidden$,
    ])
      .pipe(
        filter(([_, hidden]) => !hidden), // user can only read if document visible
        map(([msgId]) => msgId),
        distinctUntilChanged(),
        withLatestFrom(this.conversationId$)
      )
      .subscribe(([msgId, cid]) => {
        this.store.dispatch(
          selfReadMessage({ conversationId: cid, messageId: msgId })
        );
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
    this.readInformer.unsubscribe();
  }

  loadMoreMessages(conversationId: number, loadMore: boolean): void {
    if (loadMore) {
      this.store.dispatch(startLoadMoreMessages({ conversationId }));
    } else {
      this.store.dispatch(stopLoadMoreMessages());
    }
  }

  deleteMessage(conversationId: number, msg: ConversationMessageDto): void {
    this.store.dispatch(deleteMessage({ conversationId, messageId: msg.id }));
  }

  editMessage(conversationId: number, msg: ConversationMessageDto): void {
    this.dialog
      .open(EditMessageComponent, {
        data: { message: msg },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.store.dispatch(
            editMessage({
              conversationId,
              messageId: msg.id,
              text: result,
            })
          );
        }
      });
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
