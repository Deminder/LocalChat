package de.dem.localchat.dtos

import java.time.Instant

data class ConversationMessageDto(
        val id: Long,
        val text: String,
        val authorDate: Instant,
        val lastChange: Instant,
        val authorUserId: Long) {

}
