package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.Conversation
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface ConversationRepository : CrudRepository<Conversation, Long> {

    @Query("SELECT c FROM conversation c, member m, user u WHERE " +
            "m.conversation_id = c.id AND m.user_id = u.id AND u.username = :username")
    fun findAllByUsername(@Param("username") username: String): List<Conversation>

}