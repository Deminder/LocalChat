import { createReducer, on } from '@ngrx/store';
import { listConversationsSuccess } from '../actions/conversation.actions';
import {ConversationNameDto, MemberDto} from 'src/app/openapi/model/models';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export const conversationKey = 'conversation';

export interface ConversationState {
  names: EntityState<ConversationNameDto>;
  members: EntityState<MemberDto>;
  //messages: EntityState<ConversationMessageDto>;
}

export const namesAdapter = createEntityAdapter<ConversationNameDto>();
// {sortComparer: (c1,c2) => c.lastUpdate
export const membersAdapter = createEntityAdapter<MemberDto>({selectId: m => m.userId});
export const initialConversationState: ConversationState = {
  names: namesAdapter.getInitialState(),
  members: membersAdapter.getInitialState()
};

export const conversationReducer = createReducer(
  initialConversationState,
  on(listConversationsSuccess, (state, action) => ({ ...state, conversations: action.convs }))
);
