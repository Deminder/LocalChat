import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import { AddConversationComponent } from './shared/dialogs/add-conversation/add-conversation.component';
import { NotifyService } from './shared/services/notify.service';
import { addConversation } from './store/actions/conversation.actions';
import { routeBackToChat } from './store/actions/router.actions';
import { sidenavToggle } from './store/actions/user.actions';
import {
  isChatOpen,
  isMembersOpen,
  isSettingsOpen,
  selectedConversationId,
} from './store/reducers/router.reducer';
import {
  selectAppTitle,
  selectAppToolbar,
} from './store/selectors/app.selectors';
import {
  isMessageSearching,
  selectConversations,
} from './store/selectors/conversation.selectors';
import { isGlobalLoading } from './store/selectors/progress.selectors';
import {
  isSideNavOpen,
  selectSelfName,
} from './store/selectors/user.selectors';

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

  smallLayout: boolean;
  searchOpen: boolean;
  

  constructor(
    private store: Store,
    private location: Location,
    private title: Title,
    private dialog: MatDialog,
    private notifyService: NotifyService
  ) {}

  ngOnInit(): void {
    this.updateSidenavOverlay();
    this.titleUpdater = combineLatest([
      this.conversations$,
      this.store.select(selectAppTitle),
      this.notifyService.hidden$.pipe(startWith(this.notifyService.isHidden())),
    ]).subscribe(([convs, t, h]) => {
      const unreadCount = convs
        .map((c) => c.unreadCount)
        .reduce((s, v) => s + v, 0);
      if (unreadCount > 0 || !h) {
        this.title.setTitle((unreadCount > 0 ? `(${unreadCount}) ` : '') + t);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.titleUpdater) {
      this.titleUpdater.unsubscribe();
    }
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

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateSidenavOverlay();
  }

  get saveSpace(): boolean {
    return this.smallLayout && this.searchOpen;
  }

  private updateSidenavOverlay(): void {
    this.smallLayout = window.innerWidth < 624;
  }
}
