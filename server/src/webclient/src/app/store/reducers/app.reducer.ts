import { ActionReducerMap } from '@ngrx/store';
import {
  conversationReducer,
  ConversationState,
  initialConversationState,
} from './conversation.reducer';

export interface AppState {
  conversation: ConversationState;
}

export const initialAppState: AppState = {
  conversation: initialConversationState,
};

export const appreducer: ActionReducerMap<AppState, any> = {
  conversation: conversationReducer,
};
