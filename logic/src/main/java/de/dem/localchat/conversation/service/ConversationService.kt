package de.dem.localchat.conversation.service

import de.dem.localchat.conversation.entity.Conversation
import org.springframework.data.repository.query.Param
import org.springframework.security.access.prepost.PreAuthorize


interface ConversationService {

    @PreAuthorize ("#username == authentication.name")
    fun allConversationsByUserName(@Param("username") userName: String): List<Conversation>
}