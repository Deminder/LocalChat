import { createFeatureSelector, createSelector } from '@ngrx/store';
import {progressKey, ProgressState} from '../reducers/progress.reducer';

const selectProgress = createFeatureSelector(progressKey);

export const selectActiveActions = createSelector(
  selectProgress,
  (state: ProgressState) => state.activeActions
);

export const isProgressActive = createSelector(
  selectActiveActions,
  (actions) => actions.length > 0
);

