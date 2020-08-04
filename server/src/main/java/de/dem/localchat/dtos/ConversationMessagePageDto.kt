package de.dem.localchat.dtos

data class ConversationMessagePageDto(
        val convId: Long,
        val page: Int,
        val last: Boolean,
        val messages: List<ConversationMessageDto>) {

}
