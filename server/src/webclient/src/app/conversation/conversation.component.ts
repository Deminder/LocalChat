import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {selectedConversationId} from '../store/reducers/router.reducer';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  conversationId$ = this.store.select(selectedConversationId);

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

}
