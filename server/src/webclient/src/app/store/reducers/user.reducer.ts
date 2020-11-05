import { createReducer, on } from '@ngrx/store';
import { LoginTokenDto, UserDto } from '../../openapi/model/models';
import { logout } from '../actions/authorize.actions';
import {
  getSelfActions,
  listLoginTokensActions,
  sidenavToggle,
  toggleDesktopNotifications,
  toggleSoundAlerts,
} from '../actions/user.actions';

export const userKey = 'user';

export interface UserState {
  selfUser: UserDto;
  sidenavOpen: boolean;
  desktopNotifications: boolean;
  soundAlerts: boolean;
  loginTokens: LoginTokenDto[];
}

export const initialUserState: UserState = {
  selfUser: {
    username: '',
    id: -1,
    registerDate: 0,
  },
  sidenavOpen: true,
  desktopNotifications: false,
  soundAlerts: true,
  loginTokens: [],
};

export const userReducer = createReducer(
  initialUserState,
  on(getSelfActions.success, (state, action) => {
    return { ...state, selfUser: action.user };
  }),
  on(logout, (state) => {
    return {
      ...state,
      loginTokens: [],
      selfUser: { ...initialUserState.selfUser },
    };
  }),
  on(sidenavToggle, (state) => {
    return { ...state, sidenavOpen: !state.sidenavOpen };
  }),
  on(listLoginTokensActions.success, (state, action) => {
    return { ...state, loginTokens: action.tokens };
  }),
  on(toggleDesktopNotifications, (state, action) => {
    return { ...state, desktopNotifications: action.enabled };
  }),
  on(toggleSoundAlerts, (state, action) => {
    return { ...state, soundAlerts: action.enabled };
  })
);
