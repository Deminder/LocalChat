import { createReducer, on } from '@ngrx/store';
import { UserDts } from '../../openapi/model/models';
import { getSelfSuccess } from '../actions/user.actions';

export const userKey = 'user';

export interface UserState {
  selfUser: UserDts;
}

export const initialUserState: UserState = {
  selfUser: {
    username: '',
    id: -1,
    registerDate: 0,
  },
};

export const userReducer = createReducer(
  initialUserState,
  on(getSelfSuccess, (state, action) => {
    return { ...state, selfUser: action.user };
  })
);
