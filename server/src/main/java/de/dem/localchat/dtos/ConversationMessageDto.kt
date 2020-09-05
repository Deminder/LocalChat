package de.dem.localchat.dtos

import java.time.ZonedDateTime

data class ConversationMessageDto(
        val id: Long,
        val text: String,
        val authorDate: ZonedDateTime,
        val lastChange: ZonedDateTime,
        val authorName: String) {

}
