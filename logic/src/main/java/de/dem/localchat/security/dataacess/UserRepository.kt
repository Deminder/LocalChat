package de.dem.localchat.security.dataacess

import de.dem.localchat.security.entity.User
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : CrudRepository<User, Long> {

    @Query("SELECT u.* FROM \"user\" u WHERE LOWER(u.username) = LOWER(:username)")
    fun findByUsername(username: String): User?

    @Query("SELECT DISTINCT u.* FROM \"user\" u, member m, \"user\" o_user, member o_member " +
            "WHERE m.user_id = u.id AND o_member.user_id = o_user.id AND LOWER(o_user.username) = LOWER(:username) " +
            "AND m.conversation_id = o_member.conversation_id AND u.username LIKE CONCAT('%', :search, '%')")
    fun findVisibleUsersOf(username: String, search: String): List<User>

    @Query("SELECT u.* FROM \"user\" u JOIN member m ON m.user_id = u.id " +
            "WHERE m.conversation_id = :conversationId")
    fun findByConversationId(conversationId: Long): List<User>
}