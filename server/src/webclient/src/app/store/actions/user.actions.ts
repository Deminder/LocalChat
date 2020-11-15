import { createAction, props } from '@ngrx/store';
import { LoginTokenDto, UserDto } from '../../openapi/model/models';
import { createApiActions } from './actions-creation';

export type Credentials = { username: string; password: string };

export const listenForEvents = createAction('[User] Listen for Events');

export const sidenavToggle = createAction(
  '[User] Toggle Navigation Bar',
  props<{ enabled: boolean }>()
);

export const toggleDesktopNotifications = createAction(
  '[User] Toggle Desktop Notification Enabled',
  props<{ enabled: boolean }>()
);

export const toggleSoundAlerts = createAction(
  '[User] Toggle Sound Alerts Enabled',
  props<{ enabled: boolean }>()
);

export const getSelfActions = createApiActions('User', 'Get Self', {
  success: props<{ user: UserDto }>(), failure: props<{ error: ErrorEvent}>()
});

export const listLoginTokensActions = createApiActions(
  'User',
  'List Login Tokens',
  {
    success: props<{ tokens: LoginTokenDto[] }>(),
  }
);

export const deleteTokenActions = createApiActions(
  'User',
  'Delete LoginToken',
  { request: props<{ tokenId: number }>() }
);
