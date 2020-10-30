package de.dem.localchat.websocket

import de.dem.localchat.conversation.model.VoiceBuffer
import de.dem.localchat.conversation.service.VoiceChannelService
import org.springframework.web.socket.BinaryMessage
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.BinaryWebSocketHandler
import java.nio.ByteBuffer
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
                        it.poll().let { buffer ->
                            val nameArray = buffer.username.toByteArray()
                            val b = ByteBuffer.allocate(
                                    Integer.BYTES + nameArray.size + Integer.BYTES + buffer.length)
                            b.putInt(nameArray.size)
                            b.put(nameArray)
                            b.putInt(buffer.length)
                            b.put(buffer.data)
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
        withCidAndUsername(session) { cid, username ->
            voiceChannelService.leave(cid, username, session.id)
        }
        socketWorkers[session.id]?.cancel(true)

    }

    private fun withCidAndUsername(session: WebSocketSession, procedure: (cid: Long, username: String) -> Unit) =
            session.principal?.name?.let { username ->
                session.handshakeHeaders["X-ConversationId"]?.get(0)?.toLong()?.let { cid ->
                    procedure(cid, username)
                }
            } ?: session.close(CloseStatus.PROTOCOL_ERROR)
}