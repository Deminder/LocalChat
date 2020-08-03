package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.Conversation
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Repository

@Repository
interface ConversationRepository : CrudRepository<Conversation, Long> {

    @Query("select m.conversation from Member m where m.username = ?1")
    fun findAllByUserName(userName: String): List<Conversation>
}