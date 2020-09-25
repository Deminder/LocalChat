import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  listConversations,
  listMembers,
  listNextMessages,
  deleteMessage,
  editMessage,
  createMessage,
} from '../store/actions/conversation.actions';
import { selectedConversationId } from '../store/reducers/router.reducer';
import {
  selectConversationMemberEntities,
  selectConversationMessages,
} from '../store/selectors/conversation.selectors';
import { delay, filter, take } from 'rxjs/operators';
import { ConversationMessageDto } from '../openapi/model/models';
import {
  selectSelfName,
  selectSelfUserId,
} from '../store/selectors/user.selectors';

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
    setTimeout(
      () =>
        (this.switcher = this.conversationId$
          .pipe(filter((cid) => cid >= 0))
          .subscribe((cid) => {
            this.store.dispatch(listMembers({ conversationId: cid }));
            this.store.dispatch(listNextMessages({ conversationId: cid }));
          }))
    );
  }

  ngOnDestroy(): void {
    this.switcher.unsubscribe();
  }

  deleteMessage(msg: ConversationMessageDto): void {
    // TODO open confirm popup
    this.store.dispatch(deleteMessage({ messageId: msg.id }));
  }

  editMessage(msg: ConversationMessageDto): void {
    // TODO edit dialog
    this.store.dispatch(
      editMessage({ messageId: msg.id, text: msg.text + ' Edited text!' })
    );
  }

  sendMessage(text: string): void {
    this.conversationId$
      .pipe(take(1))
      .subscribe((conversationId) =>
        this.store.dispatch(createMessage({ conversationId, text }))
      );
  }
}
