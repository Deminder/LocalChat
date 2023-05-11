package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.model.VoiceBuffer
import de.dem.localchat.conversation.service.MemberService
import de.dem.localchat.conversation.service.VoiceChannelService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.concurrent.BlockingQueue
import java.util.concurrent.LinkedBlockingQueue

@Service
class VoiceChannelServiceImpl(
        @Autowired val memberService: MemberService
) : VoiceChannelService {

    private var channels: Map<Long, Map<String, BlockingQueue<VoiceBuffer>>> = emptyMap()

    @Synchronized
    override fun join(conversationId: Long, username: String, sessionId: String): BlockingQueue<VoiceBuffer>
        = if (memberService.isMember(conversationId, username, "VOICE"))
            LinkedBlockingQueue<VoiceBuffer>(100).also { queue ->
            channels = channels +
                    (conversationId to
                            channels.getOrDefault(conversationId, emptyMap()) +
                            (sid(username, sessionId) to queue))

        } else error("Missing voice permission!")


    @Synchronized
    override fun speak(voiceBuffer: VoiceBuffer) {
        channels[voiceBuffer.conversationId]?.let {
            it.entries.filterNot { (k, _) -> k.startsWith(sid(voiceBuffer.username, "")) }
                    .forEach { (_, queue) -> queue.offer(voiceBuffer.copy(data = voiceBuffer.data.duplicate())) }
        }
    }

    @Synchronized
    override fun leave(conversationId: Long, username: String, sessionId: String) {
        channels[conversationId]?.let {
            it.filterKeys { k -> k == sid(username, sessionId) }
        }?.also {
            channels = if(it.isEmpty()) channels - conversationId
            else channels + (conversationId to it)
        }
    }

    private fun sid(username: String, sessionId: String) = "${username}/${sessionId}"

}