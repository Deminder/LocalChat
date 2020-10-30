package de.dem.localchat.dtos

data class ConversationNameDto(
        val id: Long,
        val name: String,
        val createDate: Long,
        val lastUpdate: Long,
        val unreadCount: Int,
)
