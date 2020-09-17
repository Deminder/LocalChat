import { createAction, props, Action } from '@ngrx/store';

export const progressStart = createAction(
  '[Progress] Start',
  props<{action: Action}>()
);

export const progressStop = createAction(
  '[Progress] Start',
  props<{action: Action}>()
);


