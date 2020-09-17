import { ActionReducerMap } from '@ngrx/store';
import {
  conversationReducer,
  ConversationState,
  initialConversationState,
  conversationKey,
} from './conversation.reducer';

import {
  progressReducer,
  ProgressState,
  initialProgressState,
  progressKey,
} from './progress.reducer';

export interface AppState {
  [conversationKey]: ConversationState;
  [progressKey]: ProgressState;
}

export const initialAppState: AppState = {
  [conversationKey]: initialConversationState,
  [progressKey]: initialProgressState,
};

export const appreducer: ActionReducerMap<AppState, any> = {
  [conversationKey]: conversationReducer,
  [progressKey]: progressReducer,
};
