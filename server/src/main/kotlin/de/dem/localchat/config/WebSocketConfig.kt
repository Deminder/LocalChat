package de.dem.localchat.config

import de.dem.localchat.conversation.service.VoiceChannelService
import de.dem.localchat.websocket.VoiceWebSocketHandler
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor
import java.util.concurrent.ExecutorService

@Configuration
@EnableWebSocket
class WebSocketConfig : WebSocketConfigurer {

    @Autowired
    lateinit var voiceChannelService: VoiceChannelService

    @Autowired
    lateinit var executorService: ExecutorService

    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(VoiceWebSocketHandler(voiceChannelService, executorService), "/api/voice")
            .addInterceptors(HttpSessionHandshakeInterceptor())
    }

}