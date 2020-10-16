import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map, take, tap } from 'rxjs/operators';
import { AddConversationComponent } from './shared/dialogs/add-conversation/add-conversation.component';
import { addConversation } from './store/actions/conversation.actions';
import { routeBackToChat } from './store/actions/router.actions';
import {
  isMembersOpen,
  isSettingsOpen,
  selectedConversationId,
} from './store/reducers/router.reducer';
import {
  selectActiveConversation,
  selectConversations,
} from './store/selectors/conversation.selectors';
import { isGlobalLoading } from './store/selectors/progress.selectors';
import { selectSelfName } from './store/selectors/user.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  defaultTitle = 'Local Chat';
  sidenavOpen = false;

  selfName$ = this.store.select(selectSelfName);
  isGlobalLoading$ = this.store.select(isGlobalLoading);
  isSettingsOpen$ = this.store.select(isSettingsOpen);
  isMembersOpen$ = this.store.select(isMembersOpen);

  conversations$ = this.store.select(selectConversations);
  conversationId$ = this.store.select(selectedConversationId);

  toolbarTitle$ = this.store.select(selectActiveConversation).pipe(
    map((curConv) => curConv?.name ?? this.defaultTitle),
    tap((t) => this.title.setTitle(t))
  );

  constructor(
    private store: Store,
    private location: Location,
    private title: Title,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  backToChat(): void {}

  back(): void {
    this.isMembersOpen$.pipe(take(1)).subscribe((memberOpen) => {
      if (memberOpen) {
        this.store.dispatch(routeBackToChat());
      } else {
        this.location.back();
      }
    });
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
}
