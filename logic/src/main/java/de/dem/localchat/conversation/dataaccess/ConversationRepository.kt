package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.Conversation
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ConversationRepository : CrudRepository<Conversation, Long> {
    @Query("select m.conversation from Member m where m.user.name = ?1")
    fun findAllByUserName(userName: String): List<Conversation>
}