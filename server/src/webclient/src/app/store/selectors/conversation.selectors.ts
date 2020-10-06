import * as store from '@ngrx/store';
import {
  conversationKey,
  ConversationState,
  selectAllConvs,
  selectConvEntites,
  selectAllMembers,
  selectAllMessages,
  selectMemberEntites,
} from '../reducers/conversation.reducer';
import { selectedConversationId } from '../reducers/router.reducer';
import { MessageSearchRequestReq } from 'src/app/openapi/model/models';
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

export const isFirstPage = store.createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  (cid, prevPage) =>
    prevPage && prevPage.convId === cid && prevPage.request.page === 0
);

export const isLastPage = store.createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  (cid, prevPage) =>
    prevPage && prevPage.convId === cid && prevPage.last
);

export const selectNextMessagePageRequest = store.createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  (cid, prevPage): MessageSearchRequestReq => {
    return prevPage &&
      prevPage.convId === cid &&
      prevPage.request.search === null
      ? { ...prevPage, page: prevPage.request.page + 1 }
      : { page: 0, pageSize: 10 };
  }
);
