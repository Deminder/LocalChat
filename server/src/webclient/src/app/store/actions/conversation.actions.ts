import { createAction, props } from '@ngrx/store';
import {
  ConversationNameDto,
  ConversationMessageDto,
  MemberDto,
  ConversationMessagePageDto,
  MemberUpdateRequest,
} from 'src/app/openapi/model/models';
import { createApiActions } from './actions-creation';

// CONVERSATIONS

export const listConversationsActions = createApiActions(
  'Conversation',
  'List Conversations',
  { success: props<{ convs: ConversationNameDto[] }>() }
);

// single conversation actions
export type ConvRef = { conversationId: number };

export const refreshConversationActions = createApiActions(
  'Conversation',
  'Refresh Conversations',
  {
    request: props<ConvRef>(),
    success: props<{ conv: ConversationNameDto }>(),
  },
  true
);

export const addConversation = createAction(
  '[Conversation/Silent] Add Conversation',
  props<{ name: string }>()
);

export const renameConversation = createAction(
  '[Conversation/Silent] Rename Conversation',
  props<ConvRef & { name: string }>()
);

// MEMBERS

export const listMembersActions = createApiActions(
  'Conversation',
  'List Members',
  { request: props<ConvRef>(), success: props<{ members: MemberDto[] }>() }
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
export const selfReadMessage = createAction(
  '[Conversation] Self Read Message',
  props<MessageRef>()
);

export const startLoadMoreMessages = createAction(
  '[Conversation] Start Load More Messages',
  props<ConvRef>()
);

export const stopLoadMoreMessages = createAction(
  '[Conversation] Stop Load More Messages'
);

export const listNextMessagesActions = createApiActions(
  'Conversation',
  'List Next Messages',
  {
    request: props<ConvRef>(),
    success: props<{ messagePage: ConversationMessagePageDto }>(),
  },
  true
);

// MESSAGE SEARCH
export const changeMessageSearchIndex = createAction(
  '[Conversation] Change Index in Search Result',
  props<{ indexChange: number }>()
);

export const changeMessageSearchCount = createAction(
  '[Conversation] Change Count of Search Result',
  props<{ total: number }>()
);
export const changeMessageSearch = createAction(
  '[Conversation] Start Message Search',
  props<ConvRef & { search: string; regex: boolean }>()
);

// single message changes
export type MessageRef = ConvRef & { messageId: number };

export const createMessage = createAction(
  '[Conversation] Create Message',
  props<ConvRef & { text: string }>()
);

export const deleteMessage = createAction(
  '[Conversation] Delete Message',
  props<MessageRef>()
);

export const editMessage = createAction(
  '[Conversation] Edit Message',
  props<MessageRef & { text: string }>()
);

/* VOICE */

export const enableMicrophone = createAction(
  '[Conversation] Enable Mircophone',
  props<{enabled: boolean}>()
);
export const enablePlayback = createAction(
  '[Conversation] Enable Playback',
  props<{enabled: boolean}>()
);
export const switchVoiceConversation = createAction(
  '[Conversation] Switch Voice Conversation',
  props<ConvRef>()
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
