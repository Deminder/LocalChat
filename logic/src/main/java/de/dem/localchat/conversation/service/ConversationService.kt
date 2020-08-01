package de.dem.localchat.conversation.service

import de.dem.localchat.conversation.entity.Conversation


interface ConversationService {

    fun allConversationsByUserName(userName: String): List<Conversation>
}