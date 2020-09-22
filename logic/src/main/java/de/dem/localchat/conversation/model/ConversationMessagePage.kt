package de.dem.localchat.conversation.model

import de.dem.localchat.conversation.entity.ConversationMessage
import java.time.Instant

data class ConversationMessagePage(
        val conversationId: Long,
        val page: Int,
        val pageSize: Int,
        val last: Boolean,
        val messages: List<ConversationMessage>,
        val olderThan: Instant,
        val newerThan: Instant,
        val search: String? = null,
        val regex: Boolean? = null,
)