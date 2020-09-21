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

import {
  userKey, UserState, initialUserState, userReducer,
} from './user.reducer';

export interface AppState {
  [userKey]: UserState;
  [conversationKey]: ConversationState;
  [progressKey]: ProgressState;
}

export const initialAppState: AppState = {
  [userKey]: initialUserState,
  [conversationKey]: initialConversationState,
  [progressKey]: initialProgressState,
};

export const appreducer: ActionReducerMap<AppState, any> = {
  [userKey]: userReducer,
  [conversationKey]: conversationReducer,
  [progressKey]: progressReducer,
};
