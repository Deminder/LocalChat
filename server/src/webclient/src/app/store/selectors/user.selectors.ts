import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, userKey } from '../reducers/user.reducer';

const selectUser = createFeatureSelector<UserState>(userKey);

export const selectSelfName = createSelector(
  selectUser,
  (state) => state.selfUser.username
);

export const selectSelfUserId = createSelector(
  selectUser,
  (state) => state.selfUser.id
);

export const selectLoginTokens = createSelector(
  selectUser,
  (state) => state.loginTokens
);
export const areDesktopNotificationsEnabled = createSelector(
  selectUser,
  (state) => state.desktopNotifications
);

export const isSideNavOpen = createSelector(
  selectUser,
  (state) => state.sidenavOpen
);

