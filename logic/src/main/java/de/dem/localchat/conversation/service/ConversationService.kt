package de.dem.localchat.conversation.service

import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.model.ConversationMessagePage
import org.springframework.data.repository.query.Param
import org.springframework.security.access.prepost.PreAuthorize
import java.time.Instant


interface ConversationService {

    @PreAuthorize("#username == authentication.name")
    fun conversationsByUserName(@Param("username") userName: String): List<Conversation>

    @PreAuthorize("@memberService.isMember(#conversationId, authentication.name, 'READ')")
    fun membersOfConversation(@Param("conversationId") conversationId: Long): List<Member>

    @PreAuthorize("@memberService.isMember(#conversationId, authentication.name, 'READ')")
    fun conversationMessagePage(
            @Param("conversationId") conversationId: Long,
            page: Int,
            pageSize: Int,
            olderThan: Instant,
            newerThan: Instant,
            search: String?,
            regex: Boolean): ConversationMessagePage




    fun createConversation(adminName: String, conversationName: String, memberNames: Set<String>): Conversation

    @PreAuthorize("@memberService.isMember(#conversationId, authentication.name, 'ADMIN')")
    fun changeConversationName(conversationId: Long, newName: String): Conversation
}