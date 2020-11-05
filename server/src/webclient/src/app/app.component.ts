import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { take, tap } from 'rxjs/operators';
import { AddConversationComponent } from './shared/dialogs/add-conversation/add-conversation.component';
import { addConversation } from './store/actions/conversation.actions';
import { routeBackToChat } from './store/actions/router.actions';
import {
  isMembersOpen,
  isSettingsOpen,
  selectedConversationId,
  isChatOpen,
} from './store/reducers/router.reducer';
import {
  selectActiveConversation,
  selectConversations,
  isMessageSearching,
} from './store/selectors/conversation.selectors';
import { isGlobalLoading } from './store/selectors/progress.selectors';
import {
  selectSelfName,
  isSideNavOpen,
} from './store/selectors/user.selectors';
import {
  selectAppTitle,
  selectAppToolbar,
} from './store/selectors/app.selectors';
import { sidenavToggle } from './store/actions/user.actions';
import { Subscription, zip, combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  selfName$ = this.store.select(selectSelfName);
  isGlobalLoading$ = this.store.select(isGlobalLoading);
  isSettingsOpen$ = this.store.select(isSettingsOpen);
  isMembersOpen$ = this.store.select(isMembersOpen);
  isSideNavOpen$ = this.store.select(isSideNavOpen);
  isChatOpen$ = this.store.select(isChatOpen);

  conversations$ = this.store.select(selectConversations);
  conversationId$ = this.store.select(selectedConversationId);
  isSearching$ = this.store.select(isMessageSearching);

  toolbarTitle$ = this.store.select(selectAppToolbar);

  titleUpdater: Subscription;

  constructor(
    private store: Store,
    private location: Location,
    private title: Title,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.titleUpdater = combineLatest([
      this.conversations$,
      this.store.select(selectAppTitle),
    ]).subscribe(([convs, t]) => {
      const unreadCount = convs
        .map((c) => c.unreadCount)
        .reduce((s, v) => s + v, 0);
      this.title.setTitle(t + (unreadCount > 0 ? ` (${unreadCount})` : ''));
    });
  }

  ngOnDestroy(): void {
    this.titleUpdater.unsubscribe();
  }

  back(): void {
    this.location.back();
  }

  backToChat(): void {
    this.store.dispatch(routeBackToChat());
  }

  addConversation(): void {
    this.selfName$.pipe(take(1)).subscribe((selfName) =>
      this.dialog
        .open(AddConversationComponent, {
          data: { name: `Chat of ${selfName}` },
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.store.dispatch(addConversation({ name: result }));
          }
        })
    );
  }

  sidenavChange(enabled: boolean): void {
    this.store.dispatch(sidenavToggle({ enabled }));
  }
}
