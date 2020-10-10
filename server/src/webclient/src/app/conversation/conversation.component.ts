import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription, combineLatest} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {ConversationMessageDto} from '../openapi/model/models';
import {
  createMessage,
  deleteMessage,
  editMessage,
  listMembers,
  listNextMessages
} from '../store/actions/conversation.actions';
import {selectedConversationId} from '../store/reducers/router.reducer';
import {
  isFirstPage,
  isLastPage, selectConversationMemberEntities,
  selectConversationMessages,
  selectSelfMember
} from '../store/selectors/conversation.selectors';
import {selectSelfUserId} from '../store/selectors/user.selectors';

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
  selfMember$ = this.store.select(selectSelfMember);

  constructor(private store: Store) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
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
