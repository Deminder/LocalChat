import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ConversationMessageDto } from '../openapi/model/models';
import {
  createMessage,
  deleteMessage,
  editMessage,
  listMembers,
  listNextMessages,
} from '../store/actions/conversation.actions';
import { selectedConversationId } from '../store/reducers/router.reducer';
import {
  selectConversationMemberEntities,
  selectConversationMessages,
  selectPreviousMessagePage,
  isFirstPage,
  isLastPage,
} from '../store/selectors/conversation.selectors';
import { selectSelfUserId } from '../store/selectors/user.selectors';
import { MessageListComponent } from './message-list/message-list.component';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit, OnDestroy {
  conversationId$ = this.store.select(selectedConversationId);
  selfUserId$ = this.store.select(selectSelfUserId);
  conversationMessages$ = this.store.select(selectConversationMessages);
  memberEntites$ = this.store.select(selectConversationMemberEntities);
  isFirstPage$ = this.store.select(isFirstPage);
  isLastPage$ = this.store.select(isLastPage);

  sub: Subscription;
  sub2: Subscription;

  constructor(private store: Store) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.sub = this.conversationId$
        .pipe(filter((cid) => cid >= 0))
        .subscribe((cid) => {
          this.store.dispatch(listMembers({ conversationId: cid }));
          this.store.dispatch(listNextMessages({ conversationId: cid }));
        });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadMoreMessages(conversationId: number): void {
    this.isLastPage$
      .pipe(
        take(1),
        filter((v) => !v)
      )
      .subscribe(() => {
        this.store.dispatch(listNextMessages({ conversationId }));
      });
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
