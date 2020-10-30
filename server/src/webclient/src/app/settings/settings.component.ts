import { Component, OnInit } from '@angular/core';
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
  selectLoginTokens,
  selectSelfName,
  areDesktopNotificationsEnabled,
  areSoundAlertsEnabled,
} from '../store/selectors/user.selectors';
import { VoiceService } from '../shared/services/voice.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  selfName$ = this.store.select(selectSelfName);
  tokens$ = this.store.select(selectLoginTokens);
  desktopNotification$ = this.store.select(areDesktopNotificationsEnabled);
  soundAlerts$ = this.store.select(areSoundAlertsEnabled);

  voice = false;

  constructor(private voiceService: VoiceService, private store: Store) {}

  ngOnInit(): void {}

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
    this.store.dispatch(toggleDesktopNotifications({ enabled }));
  }

  enableSoundAlerts(enabled: boolean): void {
    this.store.dispatch(toggleSoundAlerts({ enabled }));
  }

  enableVoice(enabled: boolean): void {
    this.voice = enabled;
    if (this.voice) {
      this.voiceService.join(3);
    }
  }
}
