import { createAction, props } from '@ngrx/store';
import {
  ConversationNameDto,
  ConversationMessageDto,
  MemberDto,
  ConversationMessagePageDto,
  MemberUpdateRequest,
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
// single conversation actions
export type ConvRef = { conversationId: number };
export const addConversation = createAction(
  '[Conversation/Silent] Add Conversation',
  props<{ name: string }>()
);

export const renameConversation = createAction(
  '[Conversation/Silent] Rename Conversation',
  props<ConvRef & { name: string }>()
);

// MEMBERS

export const listMembers = createAction(
  '[Conversation/API] List Members',
  props<ConvRef>()
);

export const listMembersSuccess = createAction(
  '[Conversation/API] List Members Success',
  props<{ members: MemberDto[] }>()
);

export const listMembersFailure = createAction(
  '[Conversation/API] List Members Failure'
);

// single member actions

export type UserRef = { userId: number };
export type MemberRef = ConvRef & UserRef;

export const addMember = createAction(
  '[Conversation/Silent] Add Member',
  props<MemberRef>()
);

export const editMember = createAction(
  '[Conversation/Silent] Change Member',
  props<MemberRef & MemberUpdateRequest>()
);

export const removeMember = createAction(
  '[Conversation/Silent] Remove Member',
  props<MemberRef>()
);

// MESSAGES
export const startLoadMoreMessages = createAction(
  '[Conversation] Start Load More Messages',
  props<ConvRef>()
);

export const stopLoadMoreMessages = createAction(
  '[Conversation] Stop Load More Messages'
);

export const listNextMessages = createAction(
  '[Conversation/API/Silent] List Next Messages',
  props<ConvRef>()
);

export const listNextMessagesSuccess = createAction(
  '[Conversation/API] List Next Messages Success',
  props<{ messagePage: ConversationMessagePageDto }>()
);

export const listNextMessagesFailure = createAction(
  '[Conversation/API] List Next Messages Failure'
);

// MESSAGE SEARCH
export const changeMessageSearch = createAction(
  '[Conversation/Silent] Start Message Search',
  props<ConvRef & { search: string; regex: boolean }>()
);
export const searchNextMessages = createAction(
  '[Conversation/API] Search Next Messages',
  props<ConvRef & { search: string; regex: boolean }>()
);

export const searchNextMessagesSuccess = createAction(
  '[Conversation/API] Search Next Messages Success',
  props<{ messagePage: ConversationMessagePageDto }>()
);

export const searchNextMessagesFailure = createAction(
  '[Conversation/API] Search Next Messages Failure'
);


// single message changes
export type MessageRef = ConvRef & { messageId: number };

export const createMessage = createAction(
  '[Conversation/Silent] Create Message',
  props<ConvRef & { text: string }>()
);

export const deleteMessage = createAction(
  '[Conversation/Silent] Delete Message',
  props<MessageRef>()
);

export const editMessage = createAction(
  '[Conversation/Silent] Edit Message',
  props<MessageRef & { text: string }>()
);

/**
 * EVENTS
 */
export const conversationDeleted = createAction(
  '[Conversation/Event] Delete Conversation',
  props<ConvRef>()
);

export const conversationUpserted = createAction(
  '[Conversation/Event] Upsert Conversation',
  props<{ conv: ConversationNameDto }>()
);

export const messageUpserted = createAction(
  '[Conversation/Event] Upsert Message',
  props<ConvRef & { message: ConversationMessageDto }>()
);

export const messageDeleted = createAction(
  '[Conversation/Event] Delete Message',
  props<MessageRef>()
);
export const memberUpserted = createAction(
  '[Conversation/Event] Upsert Member',
  props<{ member: MemberDto }>()
);

export const memberDeleted = createAction(
  '[Conversation/Event] Delete Member',
  props<MemberRef>()
);
