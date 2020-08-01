package de.dem.localchat.conversation.model

import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage

data class ConversationMessageBatch(
        val conversation: Conversation,
        val offset: Long = 0,
        val last: Boolean = false,
        val messages: List<ConversationMessage> = emptyList()
) {
}