package de.dem.localchat.rest

import de.dem.localchat.conversation.model.ConversationEvent
import de.dem.localchat.conversation.service.EventSubscriptionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.event
import java.util.concurrent.ExecutorService
import java.util.concurrent.TimeUnit
import javax.servlet.http.HttpSession

@Controller
class ConversationEventsController(
        @Autowired val requestThreadPool: ExecutorService,
        @Autowired val eventSubscriptionService: EventSubscriptionService
) {
    private var identifier: Int = 0;

    @GetMapping("/api/events")
    fun handleSse(session: HttpSession): SseEmitter {
        val emitter = SseEmitter(-1L)
        val username = SecurityContextHolder.getContext().authentication?.name
                ?: throw ResponseStatusException(HttpStatus.FORBIDDEN, "Not logged in user!")
        val sessionId = session.id + "#${String.format("%085X", identifier++)}"
        requestThreadPool.execute {
            try {
                val queue = eventSubscriptionService.subscribeFor(username, sessionId)
                emitter.send(event().reconnectTime(1000))
                while (true) {
                    val event = queue.poll(80, TimeUnit.SECONDS)
                    if (event == null) {
                        // avoid tcp timeout
                        emitter.send(ConversationEvent("food", "banana"))
                    } else {
                        emitter.send(event)
                    }
                }
            } catch (ex: Exception) {
                emitter.completeWithError(ex)
            } finally {
                eventSubscriptionService.unsubscribeFor(username, sessionId)
            }
        }
        return emitter
    }
}