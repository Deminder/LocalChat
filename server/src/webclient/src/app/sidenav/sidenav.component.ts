import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectedConversationId } from '../store/reducers/router.reducer';
import { selectConversations } from '../store/selectors/conversation.selectors';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {

  @Input()
  conversations = [];

  @Input()
  conversationId = -1;

  @Input()
  opened: boolean;

  @Output()
  openedChange = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  toggle(): void {
    this.opened = !this.opened;
  }
}
