package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.model.ConversationEvent
import de.dem.localchat.conversation.service.EventSubscriptionService
import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentLinkedQueue

@Service
class EventSubscriptionServiceImpl : EventSubscriptionService {
    override fun subscribeFor(username: String): ConcurrentLinkedQueue<ConversationEvent> {
        TODO("Not yet implemented")
    }
}