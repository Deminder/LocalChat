package de.dem.localchat.dtos

data class ConversationMessagePageDto(
        val convId: Long,
        val page: Int,
        val pageSize: Int,
        val last: Boolean,
        val messages: List<ConversationMessageDto>,
        val olderThan: Long? = null,
        val newerThan: Long? = null,
        val search: String? = null,
        val regex: Boolean? = null
)
