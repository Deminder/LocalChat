package de.dem.localchat.dtos

data class ConversationMessageDto(
        val id: Long,
        val text: String,
        val authorDate: Long,
        val lastChange: Long,
        val authorUserId: Long) {

}
