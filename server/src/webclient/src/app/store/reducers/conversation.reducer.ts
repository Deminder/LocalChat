import { createReducer, on } from '@ngrx/store';
import { listConversationsSuccess } from '../actions/conversation.actions';

export interface ConversationState {
  currentCID: number;
}

export const initialConversationState: ConversationState = {
  currentCID: 0,
};

export const conversationReducer = createReducer(
  initialConversationState,
  on(listConversationsSuccess, (state) => ({ ...state }))
);
