import { createReducer, on } from '@ngrx/store';
import { UserDto } from '../../openapi/model/models';
import { getSelfSuccess, sidenavToggle } from '../actions/user.actions';
import {logout} from '../actions/authorize.actions';

export const userKey = 'user';

export interface UserState {
  selfUser: UserDto;
  sidenavOpen: boolean;
}

export const initialUserState: UserState = {
  selfUser: {
    username: '',
    id: -1,
    registerDate: 0,
  },
  sidenavOpen: true
};

export const userReducer = createReducer(
  initialUserState,
  on(getSelfSuccess, (state, action) => {
    return { ...state, selfUser: action.user };
  }),
  on(logout, () => {
    return { ...initialUserState };
  }),
  on(sidenavToggle, (state) => {
    return { ...state, sidenavOpen: !state.sidenavOpen };
  }),
);
