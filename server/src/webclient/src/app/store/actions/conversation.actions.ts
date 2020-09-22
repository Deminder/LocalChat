import { createAction, props } from '@ngrx/store';
import {
  ConversationNameDto,
  ConversationMessageDto,
  MemberDto,
  ConversationMessagePageDto,
} from 'src/app/openapi/model/models';

// CONVERSATIONS

export const listConversations = createAction(
  '[Conversation/API] List Conversations'
);

export const listConversationsSuccess = createAction(
  '[Conversation/API] List Conversations Success',
  props<{ convs: ConversationNameDto[] }>()
);

export const listConversationsFailure = createAction(
  '[Conversation/API] List Conversations Failure'
);

// MEMBERS

export const listMembers = createAction(
  '[Conversation/API] List Members',
  props<{ conversationId: number }>()
);

export const listMembersSuccess = createAction(
  '[Conversation/API] List Members Success',
  props<{ members: MemberDto[] }>()
);

export const listMembersFailure = createAction(
  '[Conversation/API] List Members Failure'
);

// MESSAGES

export const listNextMessages = createAction(
  '[Conversation/API] List Next Messages',
  props<{ conversationId: number }>()
);

export const listNextMessagesSuccess = createAction(
  '[Conversation/API] List Next Messages Success',
  props<{ messagePage: ConversationMessagePageDto }>()
);

export const listNextMessagesFailure = createAction(
  '[Conversation/API] List Next Messages Failure'
);

export const searchNextMessages = createAction(
  '[Conversation/API] Search Next Messages',
  props<{ conversationId: number; search: string; regex: boolean }>()
);

export const searchNextMessagesSuccess = createAction(
  '[Conversation/API] Search Next Messages Success',
  props<{ messagePage: ConversationMessagePageDto }>()
);

export const searchNextMessagesFailure = createAction(
  '[Conversation/API] Search Next Messages Failure'
);

// single message changes
export const createMessage = createAction(
  '[Conversation/Silent] Create Message',
  props<{text: string}>()
);

export const deleteMessage = createAction(
  '[Conversation/Silent] Delete Message',
  props<{messageId: number}>()
);


export const editMessage = createAction(
  '[Conversation/Silent] Edit Message',
  props<{messageId: number, text: string}>()
);


/**
 * EVENTS
 */

export const conversationDeleted = createAction(
  '[Conversation/Event] Delete Conversation',
  props<{ converstionId: number }>()
);

export const conversationAdded = createAction(
  '[Conversation/Event] Add Conversation',
  props<{ conv: ConversationNameDto }>()
);

export const messageUpserted = createAction(
  '[Conversation/Event] Upsert Message',
  props<{ message: ConversationMessageDto }>()
);

export const messageDeleted = createAction(
  '[Conversation/Event] Delete Message',
  props<{ messageId: number }>()
);
export const memberUpserted = createAction(
  '[Conversation/Event] Upsert Member',
  props<{ member: MemberDto }>()
);

export const memberDeleted = createAction(
  '[Conversation/Event] Delete Member',
  props<{ userId: number }>()
);
