import { createAction, props } from '@ngrx/store';

export const progressStart = createAction(
  '[Progress] Start',
  props<{ action: string }>()
);

export const progressStopAll = createAction(
  '[Progress] Stop All',
  props<{ action: string }>()
);

export const progressStop = createAction(
  '[Progress] Stop',
  props<{ action: string }>()
);
