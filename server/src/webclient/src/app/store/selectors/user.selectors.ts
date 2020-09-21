import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, userKey } from '../reducers/user.reducer';

const selectUser = createFeatureSelector<UserState>(userKey);

export const selectSelfName = createSelector(
  selectUser,
  (state) => state.selfUser.username
);
