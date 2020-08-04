package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.dataaccess.ConversationRepository
import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.service.ConversationService
import org.springframework.stereotype.Service

@Service
class ConversationServiceImpl(
        private val conversationRepository: ConversationRepository
) : ConversationService {
    override fun allConversationsByUserName(userName: String): List<Conversation> {
        return conversationRepository.findAllByUsername(userName)
    }

}