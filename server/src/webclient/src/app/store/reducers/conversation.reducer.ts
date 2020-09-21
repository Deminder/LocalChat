import { createReducer, on } from '@ngrx/store';
import {
  listConversationsSuccess,
  listConversationsFailure,
  conversationDeleted,
  conversationAdded,
  listMembersSuccess,
  listMembersFailure,
  listNextMessagesSuccess,
  listNextMessagesFailure,
  searchNextMessagesSuccess,
  searchNextMessagesFailure,
  memberUpserted,
  memberDeleted,
  messageUpserted,
  messageDeleted,
} from '../actions/conversation.actions';
import {
  ConversationNameDto,
  MemberDto,
  ConversationMessageDto,
  PermissionDtoRes,
  ConversationMessagePageDto,
  MessageSearchRequest,
} from 'src/app/openapi/model/models';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export const conversationKey = 'conversation';

const datecompare = (d1: number, d2: number) =>
  d1 > d2 ? 1 : d1 === d2 ? 0 : -1;

const permcompare = (
  m1: { permission: PermissionDtoRes },
  m2: { permission: PermissionDtoRes },
  permMap: (m: PermissionDtoRes) => boolean
) => Number(permMap(m1.permission)) - Number(permMap(m2.permission));

export interface ConversationState {
  names: EntityState<ConversationNameDto>;
  members: EntityState<MemberDto>;
  messages: ChatMessagesState;
}

export interface ChatMessagesState extends EntityState<ConversationMessageDto> {
  previousPage?: ConversationMessagePageDto;
}

export const namesAdapter = createEntityAdapter<ConversationNameDto>({
  sortComparer: (c1, c2) => datecompare(c1.lastUpdate, c2.lastUpdate),
});
// {sortComparer: (c1,c2) => c.lastUpdate
export const membersAdapter = createEntityAdapter<MemberDto>({
  selectId: (m) => m.userId,
  // admin order > mod order > date order;
  sortComparer: (m1, m2) =>
    permcompare(m1, m2, (p) => p.administrate) ||
    permcompare(m1, m2, (p) => p.moderate) ||
    permcompare(m1, m2, (p) => p.voice) ||
    permcompare(m1, m2, (p) => p.write) ||
    datecompare(m1.joinDate, m2.joinDate),
});

export const messagesAdapter = createEntityAdapter<ConversationMessageDto>({
  sortComparer: (m1, m2) => datecompare(m1.authorDate, m2.authorDate),
});

export const initialConversationState: ConversationState = {
  names: namesAdapter.getInitialState(),
  members: membersAdapter.getInitialState(),
  messages: messagesAdapter.getInitialState(),
};

export const {
  selectIds: selectMemberIds,
  selectEntities: selectMemberEntites,
  selectAll: selectAllMembers,
  selectTotal: selectMembersTotal,
} = membersAdapter.getSelectors();

export const {
  selectIds: selectMessageIds,
  selectEntities: selectMessageEntites,
  selectAll: selectAllMessages,
  selectTotal: selectMessageTotal,
} = messagesAdapter.getSelectors();

export const {
  selectIds: selectConvIds,
  selectEntities: selectConvEntites,
  selectAll: selectAllConvs,
  selectTotal: selectConvsTotal,
} = namesAdapter.getSelectors();

const addMessagePage = (
  page: ConversationMessagePageDto,
  adapter: EntityAdapter<ConversationMessageDto>,
  state: ChatMessagesState
) => {
  const pagingContinues =
    state.previousPage === { ...page, page: page.page + 1, messages: [] };
  const nextPageState = {
    ...state,
    prevPageReq: {...page, messages: []},
  };
  return pagingContinues
    ? adapter.addMany(page.messages, nextPageState)
    : adapter.setAll(page.messages, nextPageState);
};

export const conversationReducer = createReducer(
  initialConversationState,
  // CONVERSATIONS
  on(listConversationsSuccess, (state, action) => ({
    ...state,
    names: namesAdapter.setAll(action.convs, state.names),
  })),
  on(listConversationsFailure, (state) => ({
    ...state,
    names: namesAdapter.removeAll(state.names),
  })),
  // events
  on(conversationDeleted, (state, action) => ({
    ...state,
    names: namesAdapter.removeOne(action.converstionId, state.names),
  })),
  on(conversationAdded, (state, action) => ({
    ...state,
    names: namesAdapter.addOne(action.conv, state.names),
  })),
  // MEMBERS
  on(listMembersSuccess, (state, action) => ({
    ...state,
    members: membersAdapter.setAll(action.members, state.members),
  })),
  on(listMembersFailure, (state) => ({
    ...state,
    members: membersAdapter.removeAll(state.members),
  })),
  // events
  on(memberUpserted, (state, action) => ({
    ...state,
    members: membersAdapter.setOne(action.member, state.members),
  })),
  on(memberDeleted, (state, action) => ({
    ...state,
    members: membersAdapter.removeOne(action.userId, state.members),
  })),
  // MESSAGES
  on(listNextMessagesSuccess, (state, action) => ({
    ...state,
    messages: addMessagePage(
      action.messagePage,
      messagesAdapter,
      state.messages
    ),
  })),
  on(listNextMessagesFailure, (state) => ({ ...state })),
  on(searchNextMessagesSuccess, (state, action) => ({
    ...state,
    messages: addMessagePage(
      action.messagePage,
      messagesAdapter,
      state.messages
    ),
  })),
  on(searchNextMessagesFailure, (state) => ({ ...state })),
  // events
  on(messageUpserted, (state, action) => ({
    ...state,
    messages: messagesAdapter.setOne(action.message, state.messages),
  })),
  on(messageDeleted, (state, action) => ({
    ...state,
    messages: messagesAdapter.removeOne(action.messageId, state.messages),
  }))
);