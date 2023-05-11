package de.dem.localchat.dtos.requests

data class MessageUpsertRequest(
    val messageId: Long? = null,
    val text: String,
)
