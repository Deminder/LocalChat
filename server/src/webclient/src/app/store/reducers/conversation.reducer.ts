import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import {
  ConversationMessageDto,
  ConversationMessagePageDto,
  ConversationNameDto,
  MemberDto,
  PermissionDtoRes,
} from 'src/app/openapi/model/models';
import { logout } from '../actions/authorize.actions';
import {
  changeMessageSearch,
  changeMessageSearchCount,
  changeMessageSearchIndex,
  conversationDeleted,
  conversationUpserted,
  ConvRef,
  listConversationsActions,
  listMembersActions,
  listNextMessagesActions,
  memberDeleted,
  memberUpserted,
  messageDeleted,
  messageUpserted,
  startLoadMoreMessages,
  stopLoadMoreMessages,
  refreshConversationActions,
} from '../actions/conversation.actions';

export const conversationKey = 'conversation';

const datecompare = (d1: number, d2: number) =>
  d1 > d2 ? 1 : d1 === d2 ? 0 : -1;

const permcompare = (
  m1: { permission: PermissionDtoRes },
  m2: { permission: PermissionDtoRes },
  permMap: (m: PermissionDtoRes) => boolean
) => Number(permMap(m2.permission)) - Number(permMap(m1.permission));

export type MessageSearch = {
  search: string;
  regex: boolean;
};

export interface ConversationState {
  names: EntityState<ConversationNameDto>;
  members: EntityState<MemberDto>;
  messages: ChatMessagesState;
  search: { search: MessageSearch; index: number; count: number };
  loadMore: ConvRef | null;
}

export interface ChatMessagesState extends EntityState<ConversationMessageDto> {
  previousPage?: ConversationMessagePageDto;
}

export const namesAdapter = createEntityAdapter<ConversationNameDto>({
  sortComparer: (c1, c2) => -datecompare(c1.lastUpdate, c2.lastUpdate),
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

export const searchMessagesAdapter = createEntityAdapter<
  ConversationMessageDto
>({
  sortComparer: (m1, m2) => datecompare(m1.authorDate, m2.authorDate),
});

export const initialConversationState: ConversationState = {
  names: namesAdapter.getInitialState(),
  members: membersAdapter.getInitialState(),
  messages: messagesAdapter.getInitialState(),
  search: {
    search: { search: '', regex: false },
    index: -1,
    count: 0,
  },
  loadMore: null,
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

const resetUnreadCount = (
  conversationId: number,
  adapter: EntityAdapter<ConversationNameDto>,
  state: EntityState<ConversationNameDto>
) => {
  return adapter.updateOne(
    { id: conversationId, changes: { unreadCount: 0 } },
    state
  );
};

const addMessagePage = (
  pageResponse: ConversationMessagePageDto,
  adapter: EntityAdapter<ConversationMessageDto>,
  state: ChatMessagesState
) => {
  const nextPageState = {
    ...state,
    previousPage: { ...pageResponse },
  };
  return state.previousPage?.convId === pageResponse.convId
    ? adapter.addMany(pageResponse.messages, nextPageState)
    : adapter.setAll(pageResponse.messages, nextPageState);
};

export const conversationReducer = createReducer(
  initialConversationState,
  on(logout, () => ({ ...initialConversationState })),
  // CONVERSATIONS
  on(refreshConversationActions.success, (state, action) => ({
    ...state,
    names: namesAdapter.setOne(action.conv, state.names),
  })),
  on(listConversationsActions.success, (state, action) => ({
    ...state,
    names: namesAdapter.setAll(action.convs, state.names),
  })),
  on(listConversationsActions.failure, (state) => ({
    ...state,
    names: namesAdapter.removeAll(state.names),
  })),
  // events
  on(conversationDeleted, (state, action) => ({
    ...state,
    names: namesAdapter.removeOne(action.conversationId, state.names),
  })),
  on(conversationUpserted, (state, action) => ({
    ...state,
    names: namesAdapter.setOne(action.conv, state.names),
  })),
  // MEMBERS
  on(listMembersActions.success, (state, action) => ({
    ...state,
    members: membersAdapter.setAll(action.members, state.members),
  })),
  on(listMembersActions.failure, (state) => ({
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
  on(startLoadMoreMessages, (state, action) => ({
    ...state,
    loadMore: action as ConvRef,
  })),
  on(stopLoadMoreMessages, (state, _) => ({
    ...state,
    loadMore: null,
  })),
  on(listNextMessagesActions.success, (state, action) => ({
    ...state,
    names: resetUnreadCount(
      action.messagePage.convId,
      namesAdapter,
      state.names
    ),
    messages: addMessagePage(
      action.messagePage,
      messagesAdapter,
      state.messages
    ),
  })),
  on(changeMessageSearchIndex, (state, action) => ({
    ...state,
    search: {
      ...state.search,
      index:
        (action.indexChange + state.search.index + state.search.count) %
        state.search.count,
    },
  })),
  on(changeMessageSearchCount, (state, action) => ({
    ...state,
    search: { ...state.search, index: 0, count: action.total },
  })),
  on(changeMessageSearch, (state, action) => ({
    ...state,
    search: {
      ...initialConversationState.search,
      search: {
        search: action.search,
        regex: action.regex,
      },
    },
  })),
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
