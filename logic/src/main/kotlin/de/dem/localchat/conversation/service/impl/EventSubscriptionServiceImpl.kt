package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.model.ConversationEvent
import de.dem.localchat.conversation.service.EventSubscriptionService
import de.dem.localchat.security.dataacess.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*
import java.util.concurrent.BlockingQueue
import java.util.concurrent.LinkedBlockingQueue

@Service
class EventSubscriptionServiceImpl(
        @Autowired val userRepository: UserRepository
) : EventSubscriptionService {

    val userQueues = HashMap<String, Map<String, BlockingQueue<ConversationEvent>>>()

    @Synchronized
    override fun notifyMembers(event: ConversationEvent, conversationId: Long, vararg excluded: String) {
        userRepository.findByConversationId(conversationId)
                .map { it.username }.toSet()
                .minus(excluded.toSet())
                .forEach { name ->
                    userQueues.getOrDefault(name, emptyMap()).forEach {
                        it.value.put(event)
                    }
                }
    }

    @Synchronized
    override fun subscribeFor(username: String, sessionId: String): BlockingQueue<ConversationEvent> =
            LinkedBlockingQueue<ConversationEvent>().also {
                userQueues[username] = userQueues.getOrDefault(username, emptyMap())
                        .plus(sessionId to it)
            }

    @Synchronized
    override fun unsubscribeFor(username: String, sessionId: String) {
        userQueues[username] = userQueues.getOrDefault(username, emptyMap()).filterKeys { sessionId !== it }
        if (userQueues.isEmpty()) {
            userQueues.remove(username)
        }
    }
}