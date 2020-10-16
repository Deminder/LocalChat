import { createFeatureSelector, createSelector } from '@ngrx/store';
import {progressKey, ProgressState} from '../reducers/progress.reducer';
import {listNextMessages} from '../actions/conversation.actions';
import {selectNextMessagePageRequest, isFirstPage} from './conversation.selectors';

const selectProgress = createFeatureSelector(progressKey);

export const selectActiveActions = createSelector(
  selectProgress,
  (state: ProgressState) => state.activeActions
);


export const isProgressActive = createSelector(
  selectActiveActions,
  (actions) => actions.length > 0
);


export const isLoadingMoreMessages = createSelector(
  selectActiveActions,
  isFirstPage,
  (actions, firstPage) => !firstPage && actions.findIndex(v => v === listNextMessages.type) !== -1
);

export const isGlobalLoading = createSelector(
  isProgressActive,
  isLoadingMoreMessages,
  (active, more) => !more && active
);


