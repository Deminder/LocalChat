import { progressReducer, initialProgressState } from './progress.reducer';

describe('Progress Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = progressReducer(initialProgressState, action);

      expect(result).toBe(initialProgressState);
    });
  });
});
