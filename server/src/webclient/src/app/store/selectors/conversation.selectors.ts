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
import {createSelector, createFeatureSelector} from '@ngrx/store';

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


export const selectConversationNameEntities = createSelector(
  selectConversation,
  (state) => selectConvEntites(state.names)
);

export const selectActiveConversation = createSelector(
  selectConversationNameEntities,
  selectedConversationId,
  (convNameEntities, cid) => convNameEntities[cid]
);


export const selectConversationMembers = createSelector(
  selectConversation,
  (state) => selectAllMembers(state.members)
);

export const selectConversationMemberEntities = createSelector(
  selectConversation,
  (state) => selectMemberEntites(state.members)
);

export const selectSelfMember = createSelector(
  selectConversationMemberEntities,
  selectSelfUserId,
  (membs, uid) => membs[uid]
);

export const selectConversationMessages = createSelector(
  selectConversation,
  (state) => selectAllMessages(state.messages)
);

export const selectPreviousMessagePage = createSelector(
  selectConversation,
  (state) => state.messages.previousPage
);

export const isFirstPageNeeded = createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  isChatOpen,
  (cid, prevPage, isOpen) =>
    isOpen && cid >= 0 && (!prevPage || prevPage.convId !== cid)
);

export const areMembersNeeded = createSelector(
  selectedConversationId,
  selectConversationMembers,
  (cid, members) =>
    cid >= 0 && (members.length === 0 || members[0].convId !== cid)
);

export const selectOldestMessage = createSelector(
  selectConversationMessages,
  (messages) => (messages.length > 0 ? messages[0] : null)
);

export const selectNewestMessage = createSelector(
  selectConversationMessages,
  (messages) => (messages.length > 0 ? messages[messages.length - 1] : null)
);

export const isFirstPage = createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  selectNewestMessage,
  (cid, prevPage, newestMessage) =>
    prevPage !== undefined &&
    prevPage.convId === cid &&
    newestMessage !== null &&
    prevPage.request.olderThan > newestMessage.authorDate
);

export const isLastPage = createSelector(
  selectedConversationId,
  selectPreviousMessagePage,
  (cid, prevPage) => prevPage !== undefined && prevPage.convId === cid && prevPage.last
);

/* SEARCHING */
export const selectNextMessagePageRequest = createSelector(
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

export const selectMessageSearchState = createSelector(
  selectConversation,
  (state) => state.search
);

export const selectMessageSearch = createSelector(
  selectMessageSearchState,
  (state) => state.search
);

export const selectMessageSearchCount = createSelector(
  selectMessageSearchState,
  (state) => state.count
);

export const selectMessageSearchIndex = createSelector(
  selectMessageSearchState,
  (state) => state.index
);

export const isMessageSearching = createSelector(
  selectMessageSearch,
  (search: MessageSearch) => search.search !== ''
);

export const selectLoadMoreConversationId = createSelector(
  selectConversation,
  (state) => state.loadMore?.conversationId
);

export const isLoadingMoreMessages = createSelector(
  selectedConversationId,
  selectLoadMoreConversationId,
  isLastPage,
  (cid, scid, last) => !last && cid === scid
);

/* VOICE */
export const selectVoice = createSelector(
  selectConversation,
  (state) => state.voice
);

export const isMicrohponeEnabled = createSelector(
  selectVoice,
  (voice) => voice.microphone
);

export const isPlaybackEnabled = createSelector(
  selectVoice,
  (voice) => voice.playback
);

export const selectVoiceChannel = createSelector(
  selectVoice,
  (voice) => voice.channel
);
