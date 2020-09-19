import { createAction, props } from '@ngrx/store';
import { ConversationNameDto } from 'src/app/openapi/model/models';

export const listConversations = createAction(
  '[Conversation/API] List',
  props<{}>()
);

export const listConversationsSuccess = createAction(
  '[Conversation/API] List Success',
  props<{ convs: ConversationNameDto[] }>()
);

export const listConversationsFailure = createAction(
  '[Conversation] List Failure'
);
