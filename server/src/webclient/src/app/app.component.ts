import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { isProgressActive } from './store/selectors/progress.selectors';
import {
  isSettingsOpen,
  selectedConversationId,
} from './store/reducers/router.reducer';
import { selectSelfName } from './store/selectors/user.selectors';
import { getSelf } from './store/actions/user.actions';
import { listConversations } from './store/actions/conversation.actions';
import { selectConversations, selectActiveConversation } from './store/selectors/conversation.selectors';
import {Title} from '@angular/platform-browser';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  defaultTitle = 'Local Chat';
  sidenavOpen = false;

  selfName$ = this.store.select(selectSelfName);
  isProgressActive$ = this.store.select(isProgressActive);
  isSettingsOpen$ = this.store.select(isSettingsOpen);

  conversations$ = this.store.select(selectConversations);
  conversationId$ = this.store.select(selectedConversationId);

  toolbarTitle$ = this.store.select(selectActiveConversation).pipe(
    map((curConv) => curConv?.name ?? this.defaultTitle),
    tap((t) => this.title.setTitle(t))
  );

  constructor(private store: Store, private location: Location, private title: Title) {}

  ngOnInit(): void {
    setTimeout(() => this.store.dispatch(getSelf()));
    this.selfName$.subscribe(() => this.store.dispatch(listConversations()));
  }

  back(): void {
    this.location.back();
  }
}
