package de.dem.localchat.dtos

import java.time.Instant

data class ConversationMessagePageDto(
        val convId: Long,
        val page: Int,
        val pageSize: Int,
        val last: Boolean,
        val messages: List<ConversationMessageDto>,
        val olderThan: Instant? = null,
        val newerThan: Instant? = null,
        val search: String? = null,
        val regex: Boolean? = null
)
