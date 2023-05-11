import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginTokenDto } from '../openapi/model/models';
import { logout } from '../store/actions/authorize.actions';
import {
  deleteTokenActions,
  listLoginTokensActions,
  toggleDesktopNotifications,
  toggleSoundAlerts,
} from '../store/actions/user.actions';
import {
  areDesktopNotificationsEnabled,
  areSoundAlertsEnabled,
  selectLoginTokens,
  selectSelfName,
} from '../store/selectors/user.selectors';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  selfName$ = this.store.select(selectSelfName);
  tokens$ = this.store.select(selectLoginTokens);
  desktopNotification$ = this.store.select(areDesktopNotificationsEnabled);
  soundAlerts$ = this.store.select(areSoundAlertsEnabled);

  constructor(private store: Store) {}

  doLogout(): void {
    this.store.dispatch(logout());
  }

  openLoginTokens(): void {
    this.store.dispatch(listLoginTokensActions.request());
  }

  deleteToken(token: LoginTokenDto): void {
    this.store.dispatch(deleteTokenActions.request({ tokenId: token.id }));
  }

  enableNotifications(enabled: boolean): void {
    this.store.dispatch(toggleDesktopNotifications({ enabled }))
  }

  enableSoundAlerts(enabled: boolean): void {
    this.store.dispatch(toggleSoundAlerts({ enabled }));
  }
}
