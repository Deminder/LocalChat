import { createAction, props } from '@ngrx/store';
import { UserDto } from '../../openapi/model/models';

export type Credentials = { username: string; password: string };

export const listenForEvents = createAction('[User] Listen for Events');

export const getSelf = createAction('[User] Get Self');

export const getSelfSuccess = createAction(
  '[User] Get Self Success',
  props<{ user: UserDto }>()
);

export const getSelfFailure = createAction('[User] Get Self Failure');
