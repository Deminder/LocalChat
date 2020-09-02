package de.dem.localchat.rest

import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.dtos.ConversationNameDto
import de.dem.localchat.dtos.toConversationNameDto
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/conversation")
class ConversationController(private val conversationService: ConversationService) {

    @GetMapping
    fun allConversationsOfUser(): List<ConversationNameDto> {
        val auth: Authentication = SecurityContextHolder.getContext().authentication ?: error("Not logged in!")
        return conversationService.allConversationsByUserName(auth.name ?: error("Missing username!"))
                .map { it.toConversationNameDto() }
    }
}