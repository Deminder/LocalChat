import { userReducer, initialUserState } from './user.reducer';

describe('User Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = userReducer(initialUserState, action);

      expect(result).toBe(initialUserState);
    });
  });
});
