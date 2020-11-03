package de.dem.localchat.conversation.model

import de.dem.localchat.conversation.entity.ConversationMessage
import java.time.Instant

data class ConversationMessagePage(
        val last: Boolean,
        val messages: List<ConversationMessage>,
)