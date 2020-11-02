package de.dem.localchat.websocket

import de.dem.localchat.conversation.model.VoiceBuffer
import de.dem.localchat.conversation.service.VoiceChannelService
import org.springframework.web.socket.BinaryMessage
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.BinaryWebSocketHandler
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.concurrent.ExecutorService
import java.util.concurrent.Future

class VoiceWebSocketHandler(
        private val voiceChannelService: VoiceChannelService,
        private val executorService: ExecutorService,
) : BinaryWebSocketHandler() {

    private var socketWorkers: Map<String, Future<*>> = emptyMap()

    override fun afterConnectionEstablished(session: WebSocketSession) {
        withCidAndUsername(session) { cid, username ->
            voiceChannelService.join(cid, username, session.id).also {
                socketWorkers[session.id]?.cancel(true)
                socketWorkers = socketWorkers + (session.id to executorService.submit {
                    while (session.isOpen) {
                        it.take().let { buffer ->
                            val nameArray = buffer.username.toByteArray()
                            val b = ByteBuffer.allocate(
                                    Integer.BYTES + nameArray.size + buffer.length)
                                    .order(ByteOrder.LITTLE_ENDIAN)
                            b.putInt(nameArray.size)
                            b.put(nameArray)
                            b.put(buffer.data)
                            b.rewind()
                            session.sendMessage(BinaryMessage(b))
                        }
                    }
                })
            }
        }
    }

    override fun handleBinaryMessage(session: WebSocketSession, message: BinaryMessage) {
        withCidAndUsername(session) { cid, username ->
            voiceChannelService.speak(VoiceBuffer(cid, username, message.payload, message.payloadLength))
        }
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        socketWorkers[session.id]?.cancel(true)
        withCidAndUsername(session) { cid, username ->
            voiceChannelService.leave(cid, username, session.id)
        }
    }

    private fun queryToConversationId(query: String) =
            if (query.startsWith("cid=")) query.substring("cid=".length).toLong() else null

    private fun withCidAndUsername(session: WebSocketSession, procedure: (cid: Long, username: String) -> Unit) =
            session.principal?.name?.let { username ->
                session.uri?.query?.let { queryToConversationId(it) }?.let { cid ->
                    procedure(cid, username)
                }
            } ?: session.close(CloseStatus.PROTOCOL_ERROR)
}