import { createAction, props } from '@ngrx/store';

export const listConversations = createAction(
  '[Conversation List] Load Conversation List',
  props<{}>()
);

export const listConversationsSuccess = createAction(
  '[Conversation List] Load Conversation List Success',
  props<{id: number}>()
);
