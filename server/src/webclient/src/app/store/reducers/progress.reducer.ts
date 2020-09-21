import {createReducer, on} from '@ngrx/store';
import {progressStart, progressStop} from '../actions/progress.actions';

export const progressKey = 'progress';

export interface ProgressState {
  activeActions: string[];
}

export const initialProgressState: ProgressState = {
  activeActions: [],
};

export const progressReducer = createReducer(
  initialProgressState,
  on(progressStart, (state, a) => ({
    ...state,
    activeActions: [...state.activeActions, a.action],
  })),
  on(progressStop, (state, a) => ({
    ...state,
    activeActions: state.activeActions.filter((action) => action !== a.action),
  }))
);
