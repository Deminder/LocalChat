package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.Conversation
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ConversationRepository : CrudRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c JOIN c.members mem WHERE mem.user.username = ?1")
    fun findAllByUsername(username: String): List<Conversation>

}