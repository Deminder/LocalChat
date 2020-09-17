import { createAction, props } from '@ngrx/store';

export type Credentials = {username: string, password: string};

export const login = createAction(
  '[Authorize] Login Send',
  props<{creds: Credentials}>()
);

export const logout = createAction(
  '[Authorize] Logout Send'
);

export const register = createAction(
  '[Authorize] Register Send',
  props<{creds: Credentials}>()
);

export const registerSuccess = createAction(
  '[Authorize] Register Success',
  props<{creds: Credentials}>()
);
