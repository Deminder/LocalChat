package de.dem.localchat.dtos

import de.dem.localchat.dtos.requests.MessageSearchRequest

data class ConversationMessagePageDto(
        val convId: Long,
        val request: MessageSearchRequest,
        val last: Boolean,
        val messages: List<ConversationMessageDto>,
)
