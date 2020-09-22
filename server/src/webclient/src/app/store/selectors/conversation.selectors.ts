import { createFeatureSelector, createSelector } from '@ngrx/store';
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

const selectConversation = createFeatureSelector<ConversationState>(
  conversationKey
);

const selectConversationNames = createSelector(
  selectConversation,
  (state) => state.names
);

export const selectConversations = createSelector(
  selectConversationNames,
  (state) => selectAllConvs(state)
);

export const selectActiveConversation = createSelector(
  selectConversation,
  selectedConversationId,
  (state, cid) => selectConvEntites(state.names)[cid]
);

export const selectConversationMembers = createSelector(
  selectConversation,
  (state) => selectAllMembers(state.members)
);

export const selectConversationMemberEntities = createSelector(
  selectConversation,
  (state) => selectMemberEntites(state.members)
);

export const selectConversationMessages = createSelector(
  selectConversation,
  (state) => selectAllMessages(state.messages)
);

export const selectPreviousMessagePage = createSelector(
  selectConversation,
  (state) => state.messages.previousPage
);

export const selectNextMessagePageRequest = createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  (cid, prevPage): MessageSearchRequestReq => {
    return prevPage && prevPage.convId === cid && prevPage.request.search === null
      ? { ...prevPage, page: prevPage.request.page + 1 }
      : { page: 0, pageSize: 10 };
  }
);
