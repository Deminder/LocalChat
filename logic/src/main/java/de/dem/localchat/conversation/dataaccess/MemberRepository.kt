package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.Member
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface MemberRepository : CrudRepository<Member, Long> {

    @Query("SELECT m FROM member m, user u WHERE " +
            "m.conversation.id = :cid AND u.id = m.user.id AND u.username = :username")
    fun findByIdAndUsername(@Param("cid") conversationId: Long,
                            @Param("username") username: String): Member?

    fun findByConversationIdAndUserId(conversationId: Long, userId: Long): Member?

    fun findByConversationId(conversationId: Long): List<Member>
}