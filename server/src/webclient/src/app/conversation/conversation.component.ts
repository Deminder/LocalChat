import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  listConversations,
  listMembers,
  listNextMessages,
} from '../store/actions/conversation.actions';
import { selectedConversationId } from '../store/reducers/router.reducer';
import {
  selectConversationMemberEntities,
  selectConversationMessages,
} from '../store/selectors/conversation.selectors';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit, OnDestroy {
  conversationId$ = this.store.select(selectedConversationId);
  conversationMessages$ = this.store.select(selectConversationMessages);
  memberEntites$ = this.store.select(selectConversationMemberEntities);

  switcher: Subscription;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.switcher = this.conversationId$.subscribe((cid) => {
      this.store.dispatch(listMembers({ conversationId: cid }));
      this.store.dispatch(listNextMessages({ conversationId: cid }));
    });
  }

  ngOnDestroy(): void {
    this.switcher.unsubscribe();
  }
}
