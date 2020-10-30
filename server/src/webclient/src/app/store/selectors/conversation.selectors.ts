import * as store from '@ngrx/store';
import { MessageSearchRequestReq } from 'src/app/openapi/model/models';
import {
  conversationKey,
  ConversationState,
  selectAllConvs,
  selectAllMembers,
  selectAllMessages,
  selectConvEntites,
  selectMemberEntites,
  MessageSearch,
} from '../reducers/conversation.reducer';
import { isChatOpen, selectedConversationId } from '../reducers/router.reducer';
import { selectSelfUserId } from './user.selectors';

const selectConversation = store.createFeatureSelector<ConversationState>(
  conversationKey
);

const selectConversationNames = store.createSelector(
  selectConversation,
  (state) => state.names
);

export const selectConversations = store.createSelector(
  selectConversationNames,
  (state) => selectAllConvs(state)
);

export const selectConversationNameEntities = store.createSelector(
  selectConversation,
  (state) => selectConvEntites(state.names)
);

export const selectActiveConversation = store.createSelector(
  selectConversationNameEntities,
  selectedConversationId,
  (convNameEntities, cid) => convNameEntities[cid]
);

export const selectConversationMembers = store.createSelector(
  selectConversation,
  (state) => selectAllMembers(state.members)
);

export const selectConversationMemberEntities = store.createSelector(
  selectConversation,
  (state) => selectMemberEntites(state.members)
);

export const selectSelfMember = store.createSelector(
  selectConversationMemberEntities,
  selectSelfUserId,
  (membs, uid) => membs[uid]
);

export const selectConversationMessages = store.createSelector(
  selectConversation,
  (state) => selectAllMessages(state.messages)
);

export const selectPreviousMessagePage = store.createSelector(
  selectConversation,
  (state) => state.messages.previousPage
);

export const isFirstPageNeeded = store.createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  isChatOpen,
  (cid, prevPage, isOpen) =>
    isOpen && cid >= 0 && (!prevPage || prevPage.convId !== cid)
);

export const areMembersNeeded = store.createSelector(
  selectedConversationId,
  selectConversationMembers,
  (cid, members) =>
    cid >= 0 && (members.length === 0 || members[0].convId !== cid)
);

export const selectOldestMessage = store.createSelector(
  selectConversationMessages,
  (messages) => (messages.length > 0 ? messages[0] : null)
);

export const selectNewestMessage = store.createSelector(
  selectConversationMessages,
  (messages) => (messages.length > 0 ? messages[messages.length - 1] : null)
);

export const isFirstPage = store.createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  selectNewestMessage,
  (cid, prevPage, newestMessage) =>
    prevPage &&
    prevPage.convId === cid &&
    newestMessage &&
    prevPage.request.olderThan > newestMessage.authorDate
);

export const isLastPage = store.createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  (cid, prevPage) => prevPage && prevPage.convId === cid && prevPage.last
);

export const selectNextMessagePageRequest = store.createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  (cid, prevPage): MessageSearchRequestReq => {
    return prevPage &&
      prevPage.convId === cid &&
      prevPage.request.search === null
      ? {
          pageSize: 10,
          olderThan: prevPage.messages
            ? prevPage.messages[prevPage.messages.length - 1].authorDate
            : Date.now(),
        }
      : { pageSize: 40 };
  }
);

export const selectMessageSearchState = store.createSelector(
  selectConversation,
  (state) => state.search
);

export const selectMessageSearch = store.createSelector(
  selectMessageSearchState,
  (state) => state.search
);

export const selectMessageSearchCount = store.createSelector(
  selectMessageSearchState,
  (state) => state.count
);

export const selectMessageSearchIndex = store.createSelector(
  selectMessageSearchState,
  (state) => state.index
);

export const isMessageSearching = store.createSelector(
  selectMessageSearch,
  (search: MessageSearch) => search.search !== ''
);

export const selectLoadMoreConversationId = store.createSelector(
  selectConversation,
  (state) => state.loadMore?.conversationId
);

export const isLoadingMoreMessages = store.createSelector(
  selectedConversationId,
  selectLoadMoreConversationId,
  isLastPage,
  (cid, scid, last) => !last && cid === scid
);
