package de.dem.localchat.conversation.service

import de.dem.localchat.conversation.model.VoiceBuffer
import org.springframework.data.repository.query.Param
import org.springframework.security.access.prepost.PreAuthorize
import java.util.concurrent.BlockingQueue


interface VoiceChannelService {

    fun speak(voiceBuffer: VoiceBuffer)
    fun leave(conversationId: Long, username: String, sessionId: String)

    fun join(@Param("cid") conversationId: Long,
             @Param("username") username: String,
             sessionId: String
    ): BlockingQueue<VoiceBuffer>
}