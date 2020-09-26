package de.dem.localchat.dtos.requests

import javax.validation.constraints.Size

data class ConversationRenameRequest(
        val conversationId: Long,

        @field: Size(max = 40, message = "Conversation name must be between 0 and 40 characters")
        val conversationName: String,
)