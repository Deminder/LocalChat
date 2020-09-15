package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.ConversationMessage
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface ConversationMessageRepository : PagingAndSortingRepository<ConversationMessage, Long> {

    @Query("SELECT cm FROM conversation_message cm WHERE " +
            "cm.conversation_id = :cid")
    fun findAllByConversationId(@Param("cid") conversationId: Long, pageable: Pageable): Page<ConversationMessage>

    @Query("SELECT m FROM conversation_message m WHERE " +
            "m.conversation_id = :cid AND m.text ~ :pattern")
    fun findAllMessagesByPattern(@Param("cid") conversationId: Long,
                                 @Param("pattern") searchPattern: String,
                                 pageable: Pageable): Page<ConversationMessage>

    @Query("SELECT m FROM conversation_message m WHERE " +
            "m.conversation_id = :convId AND m.text LIKE CONCAT('%', :pattern, '%')")
    fun findAllMessagesByString(@Param("convId") conversationId: Long,
                                @Param("pattern") searchPattern: String,
                                pageable: Pageable): Page<ConversationMessage>
}