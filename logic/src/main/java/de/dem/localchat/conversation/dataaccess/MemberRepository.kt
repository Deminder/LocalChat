package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.Member
import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface MemberRepository : CrudRepository<Member, Long> {

    @Query("SELECT m.* FROM member m, \"user\" u WHERE " +
            "m.conversation_id = :conversationId AND u.id = m.user_id AND LOWER(u.username) = LOWER(:username)")
    fun findByIdAndUsername(conversationId: Long,
                            username: String): Member?

    @Query("SELECT m.* FROM member m WHERE " +
            "m.conversation_id = :conversationId AND m.user_id = :userId")
    fun findByConvIdAndUserId(conversationId: Long, userId: Long): Member?

    @Query("SELECT m.* FROM member m WHERE " +
            "m.conversation_id = :conversationId " +
            "ORDER BY m.join_date")
    fun findAllByConversationId(conversationId: Long): List<Member>

    @Query("SELECT COUNT(m.id) FROM member m WHERE " +
            "m.conversation_id = :conversationId" )
    fun countByConversationId(conversationId: Long): Int

}