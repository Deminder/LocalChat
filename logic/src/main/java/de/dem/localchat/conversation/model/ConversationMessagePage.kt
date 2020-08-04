package de.dem.localchat.conversation.model

import de.dem.localchat.conversation.entity.ConversationMessage

data class ConversationMessagePage(
        val conversationId: Long,
        val page: Int = 0,
        val last: Boolean = false,
        val messages: List<ConversationMessage> = emptyList()
) {
}