import { conversationReducer, initialConversationState } from './conversation.reducer';

describe('Conversation Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = conversationReducer(initialConversationState, action);

      expect(result).toBe(initialConversationState);
    });
  });
});
