import { CdkScrollable } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { animationFrameScheduler, Subscription } from 'rxjs';
import {
  auditTime,
  distinctUntilChanged,
  filter,
  map,
  take,
} from 'rxjs/operators';
import { ConversationMessageDto } from '../openapi/model/models';
import {
  createMessage,
  deleteMessage,
  editMessage,
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
export class ConversationComponent implements OnInit, OnDestroy, AfterViewInit {
  conversationId$ = this.store.select(selectedConversationId);
  selfUserId$ = this.store.select(selectSelfUserId);
  conversationMessages$ = this.store.select(selectConversationMessages);
  memberEntites$ = this.store.select(selectConversationMemberEntities);
  isFirstPage$ = this.store.select(isFirstPage);
  newestConversationMessage$ = this.store.select(selectNewestMessage);
  isLastPage$ = this.store.select(isLastPage);
  selfMember$ = this.store.select(selectSelfMember);
  loadingMoreMessages$ = this.store.select(isLoadingMoreMessages);

  @ViewChild(MessageListComponent)
  messageList: MessageListComponent;

  @ViewChild(CdkScrollable)
  messageScrollable: CdkScrollable;

  downScroller: Subscription;
  scrollToLowestMsgIds = -1;
  bottomScroll = -1;

  updater: Subscription;

  constructor(private store: Store, private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.downScroller = this.newestConversationMessage$
      .pipe(
        filter((msg) => msg !== null),
        map((msg) => msg.id),
        distinctUntilChanged()
      )
      .subscribe((msgId) => {
        this.scrollToLowestMsgIds = msgId;
        // scrolls shortly after keepScrollRelativeToBottom fired
        this.ngZone.runOutsideAngular(() => {
          animationFrameScheduler.schedule(() => {
            this.messageScrollable.scrollTo({ bottom: 0, behavior: 'smooth'});
          }, 10);
        });
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
  }

  keepScrollRelativeToBottom(): void {
    // measure size before view updates
    this.bottomScroll =
      this.messageScrollable?.measureScrollOffset('bottom') ?? 0;
    const scrollBottomTarget = this.bottomScroll;
    // scrolls right after change detection is done
    this.ngZone.runOutsideAngular(() => {
      animationFrameScheduler.schedule(() => {
        this.messageScrollable.scrollTo({ bottom: scrollBottomTarget });
      });
    });
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
}
