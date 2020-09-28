package de.dem.localchat.rest

import de.dem.localchat.conversation.model.ConversationEvent
import de.dem.localchat.conversation.service.EventSubscriptionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.util.concurrent.ExecutorService
import java.util.concurrent.TimeUnit
import javax.servlet.http.HttpSession

@Controller
class ConversationEventsController(
        @Autowired val requestThreadPool: ExecutorService,
        @Autowired val eventSubscriptionService: EventSubscriptionService
) {
    @GetMapping("/api/events")
    fun handleSse(session: HttpSession): SseEmitter? {
        val emitter = SseEmitter()
        val username = SecurityContextHolder.getContext().authentication?.name ?: error("Not logged in!")
        val sessionId = session.id
        requestThreadPool.execute {
            try {
                val queue = eventSubscriptionService.subscribeFor(username, sessionId)
                while (true) {
                    val event = queue.poll(1, TimeUnit.MINUTES)
                    if (event == null) {
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