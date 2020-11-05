import { selectActiveConversation } from './conversation.selectors';
import {
  isChatOpen,
  isMembersOpen,
  isSettingsOpen,
} from '../reducers/router.reducer';
import { createSelector } from '@ngrx/store';

export const selectAppTitle = createSelector(
  selectActiveConversation,
  isChatOpen,
  isMembersOpen,
  isSettingsOpen,
  (conv, chat, member, settings) =>
    settings
      ? 'Settings'
      : conv
      ? conv.name +
        (member ? ' | Members' : chat ? ' | Chat' : ' | Conversation')
      : 'Local Chat'
);

// shortened app title
export const selectAppToolbar = createSelector(
  selectAppTitle,
  isMembersOpen,
  (title, member) => (member ? 'Members - ' : '') + title.split('|')[0]
);
