package de.dem.localchat.conversation.service

import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import org.springframework.data.domain.Page
import org.springframework.data.repository.query.Param
import org.springframework.security.access.prepost.PreAuthorize


interface ConversationService {

    @PreAuthorize("#username == authentication.name")
    fun conversationsByUserName(@Param("username") userName: String): List<Conversation>

    @PreAuthorize("@memberService.isMember(#conversationId, authentication.name, 'READ')")
    fun membersOfConversation(@Param("conversationId") conversationId: Long): List<Member>

    @PreAuthorize("@memberService.isMember(#conversationId, authentication.name, 'READ')")
    fun conversationMessagePage(
            @Param("conversationId") conversationId: Long,
            page: Int,
            pageSize: Int): Page<ConversationMessage>

    @PreAuthorize("@memberService.isMember(#conversationId, authentication.name, 'READ')")
    fun searchConversationMessages(
            @Param("conversationId") conversationId: Long,
            searchPattern: String,
            regex: Boolean,
            page: Int,
            pageSize: Int): Page<ConversationMessage>


    fun createConversation(adminName: String, conversationName: String, memberNames: Set<String>): Conversation

    @PreAuthorize("@memberService.isMember(#conversationId, authentication.name, 'ADMIN')")
    fun changeConversationName(conversationId: Long, newName: String): Conversation
}