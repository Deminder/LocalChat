package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.Member
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface MemberRepository : CrudRepository<Member, Long> {

    fun findByConversationIdAndUserUsername(conversationId: Long, username: String): Member?
    fun findByConversationIdAndUserId(conversationId: Long, userId: Long): Member?

    fun findByConversationId(conversationId: Long): List<Member>
}