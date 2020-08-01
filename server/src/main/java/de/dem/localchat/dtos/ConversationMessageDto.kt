package de.dem.localchat.dtos

import java.time.LocalDateTime

data class ConversationMessageDto(
        val id: Long,
        val text: String,
        val authorDate: LocalDateTime,
        val lastChange: LocalDateTime,
        val authorName: String) {

}
