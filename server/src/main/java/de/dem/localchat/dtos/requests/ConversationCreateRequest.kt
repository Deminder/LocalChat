package de.dem.localchat.dtos.requests

import jakarta.validation.Valid
import jakarta.validation.constraints.Size

data class ConversationCreateRequest(
    @field: Size(min = 1, max = 40, message = "Conversation name must be between 1 and 40 characters")
    val name: String,

    @field: Valid
    val memberNames: Set<@Size(
        min = 4,
        max = 20,
        message = "Member username must be between 4 and 20 characters"
    ) String>
) {
}