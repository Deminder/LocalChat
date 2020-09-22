package de.dem.localchat.conversation.service

import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.model.ConversationEvent
import java.util.concurrent.ConcurrentLinkedQueue


interface EventSubscriptionService {

    fun subscribeFor(username: String): ConcurrentLinkedQueue<ConversationEvent>
}