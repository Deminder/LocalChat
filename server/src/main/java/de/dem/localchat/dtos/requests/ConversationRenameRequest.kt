package de.dem.localchat.dtos.requests

import javax.validation.Valid
import javax.validation.constraints.Size

data class ConversationRenameRequest(
        @field: Size(max = 40, message = "Conversation name must be between 0 and 40 characters")
        val conversationName: String,

        @field: Valid
        val memberNames: Set<@Size(min = 4, max = 20, message = "Member username must be between 4 and 20 characters") String>
) {
}