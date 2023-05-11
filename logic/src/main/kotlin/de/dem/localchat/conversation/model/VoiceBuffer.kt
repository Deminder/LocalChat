package de.dem.localchat.conversation.model

import java.nio.ByteBuffer

data class VoiceBuffer(
        val conversationId: Long,
        val username: String,
        val data: ByteBuffer,
        val length: Int,
)
