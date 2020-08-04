package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.Conversation
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Repository

@Repository
interface ConversationRepository : CrudRepository<Conversation, Long> {

    @Query("select c from conversation c" +
            "inner join member m on m.conversation = c.id" +
            " inner join user u on m.user = u.id" +
            " where u.username = ?1", nativeQuery = true)
    fun findAllByUsername(username: String): List<Conversation>
}