import { createReducer, on } from '@ngrx/store';
import {
  progressStart,
  progressStopAll,
  progressStop,
} from '../actions/progress.actions';

export const progressKey = 'progress';

export interface ProgressState {
  activeActions: string[];
}

export const initialProgressState: ProgressState = {
  activeActions: [],
};

function removeOne<T>(array: T[], predicate: (v: T) => boolean): T[] {
  const i = array.findIndex(predicate);
  return i === -1 ? [...array] : array.slice(0, i).concat(array.slice(i + 1, array.length));
}

export const progressReducer = createReducer(
  initialProgressState,
  on(progressStart, (state, a) => ({
    ...state,
    activeActions: [...state.activeActions, a.action],
  })),
  on(progressStopAll, (state, a) => ({
    ...state,
    activeActions: state.activeActions.filter((action) => action !== a.action),
  })),
  on(progressStop, (state, a) => ({
    ...state,
    activeActions: removeOne(
      state.activeActions,
      (action) => action === a.action
    ),
  }))
);
