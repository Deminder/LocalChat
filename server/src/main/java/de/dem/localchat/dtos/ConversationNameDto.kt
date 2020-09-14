package de.dem.localchat.dtos

import java.time.Instant

data class ConversationNameDto(
        val id: Long,
        val name: String,
        val createDate: Instant) {

}
