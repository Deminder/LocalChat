package de.dem.localchat.conversation.service

import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.model.ConversationMessagePage
import org.springframework.data.repository.query.Param
import org.springframework.security.access.prepost.PreAuthorize
import java.time.Instant


interface ConversationService {

    fun getConversation(conversationId: Long): Conversation?

    fun listConversations(): List<Conversation>

    @PreAuthorize("@memberServiceImpl.isMember(#cid, authentication.name, 'READ', 'ADMIN')")
    fun membersOfConversation(@Param("cid") conversationId: Long): List<Member>

    @PreAuthorize("@memberServiceImpl.isMember(#cid, authentication.name, 'READ')")
    fun conversationMessagePage(
            @Param("cid") conversationId: Long,
            page: Int,
            pageSize: Int,
            olderThan: Instant,
            newerThan: Instant,
            search: String?,
            regex: Boolean?): ConversationMessagePage


    @PreAuthorize("@memberServiceImpl.isMember(#cid, authentication.name, 'READ')")
    fun countUnreadMessages(
            @Param("cid") conversationId: Long,
            ): Int

    @PreAuthorize("@memberServiceImpl.isMember(#cid, authentication.name, 'READ')")
    fun memberReadsConversation(
            @Param("cid") conversationId: Long
    )

    fun createConversation(conversationName: String, memberNames: Set<String>): Conversation

    @PreAuthorize("@memberServiceImpl.isMember(#cid, authentication.name, 'ADMIN')")
    fun changeConversationName(@Param("cid") conversationId: Long, newName: String): Conversation

    @PreAuthorize("@memberServiceImpl.isMember(#cid, authentication.name, 'WRITE')")
    fun upsertMessage(@Param("cid") conversationId: Long, messageId: Long?, text: String): ConversationMessage

    @PreAuthorize("@memberServiceImpl.isMember(#cid, authentication.name, 'MOD') || " +
            "@memberServiceImpl.wroteMessage(#cid, authentication.name, #mid)")
    fun deleteMessage(@Param("cid") conversationId: Long, @Param("mid") messageId: Long)


}