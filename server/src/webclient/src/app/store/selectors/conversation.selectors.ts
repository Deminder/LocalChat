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

export const selectActiveConversation = store.createSelector(
  selectConversation,
  selectedConversationId,
  (state, cid) => selectConvEntites(state.names)[cid]
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
  selectOldestMessage,
  (cid, prevPage, oldestMessage) =>
    prevPage &&
    prevPage.convId === cid &&
    oldestMessage &&
    prevPage.request.olderThan > oldestMessage.authorDate
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
