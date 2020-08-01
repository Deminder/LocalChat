package de.dem.localchat.dtos

data class ConversationMessageBatchDto(
        val convId: Long,
        val offset: Long,
        val last: Boolean,
        val messages: List<ConversationMessageDto>) {

}
