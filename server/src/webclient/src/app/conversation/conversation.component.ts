import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
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
} from '../store/selectors/conversation.selectors';
import { selectSelfUserId } from '../store/selectors/user.selectors';

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

  switcher: Subscription;

  constructor(private store: Store) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.switcher = this.conversationId$
        .pipe(filter((cid) => cid >= 0))
        .subscribe((cid) => {
          this.store.dispatch(listMembers({ conversationId: cid }));
          this.store.dispatch(listNextMessages({ conversationId: cid }));
        });
    });
  }

  ngOnDestroy(): void {
    this.switcher.unsubscribe();
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
