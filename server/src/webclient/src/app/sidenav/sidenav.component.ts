import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectedConversationId } from '../store/reducers/router.reducer';
import { selectConversations } from '../store/selectors/conversation.selectors';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  conversations$ = this.store.select(selectConversations);
  conversationId$ = this.store.select(selectedConversationId);

  opened: boolean;

  constructor(private store: Store) {}

  ngOnInit(): void {}

  toggle(): void {
    this.opened = !this.opened;
  }
}
