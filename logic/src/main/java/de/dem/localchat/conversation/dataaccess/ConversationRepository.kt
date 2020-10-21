package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.Conversation
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface ConversationRepository : CrudRepository<Conversation, Long> {

    @Query("SELECT c.*, ci.last_author_date as last_update " +
            "FROM conversation c, conversation_info ci, member m, \"user\" u WHERE " +
            "c.id = ci.id AND m.conversation_id = c.id AND m.user_id = u.id AND u.username = :username " +
            "ORDER BY last_update DESC")
    fun findAllByUsername(@Param("username") username: String): List<Conversation>

    @Query("SELECT c.*, ci.last_author_date as last_update " +
            "FROM conversation c JOIN conversation_info ci ON c.id = ci.id WHERE c.id = :conversationId")
    fun findConvById(conversationId: Long): Conversation

}