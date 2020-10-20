import {createFeatureSelector, createSelector} from '@ngrx/store';
import {progressKey, ProgressState} from '../reducers/progress.reducer';
import {isLoadingMoreMessages} from './conversation.selectors';

const selectProgress = createFeatureSelector(progressKey);

export const selectActiveActions = createSelector(
  selectProgress,
  (state: ProgressState) => state.activeActions
);


export const isProgressActive = createSelector(
  selectActiveActions,
  (actions) => actions.length > 0
);



export const isGlobalLoading = createSelector(
  isProgressActive,
  isLoadingMoreMessages,
  (active, more) => !more && active
);


