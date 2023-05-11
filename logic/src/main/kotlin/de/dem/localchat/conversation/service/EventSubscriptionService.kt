package de.dem.localchat.conversation.service

import de.dem.localchat.conversation.model.ConversationEvent
import java.util.concurrent.BlockingQueue


interface EventSubscriptionService {

    fun notifyMembers(event: ConversationEvent, conversationId: Long, vararg excluded: String)
    fun unsubscribeFor(username: String, sessionId: String)
    fun subscribeFor(username: String, sessionId: String): BlockingQueue<ConversationEvent>
}