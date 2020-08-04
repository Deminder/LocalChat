package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.ConversationMessage
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface ConversationMessageRepository : PagingAndSortingRepository<ConversationMessage, Long> {

    fun findAllByConversationId(conversationId: Long, pageable: Pageable): Page<ConversationMessage>

    @Query(value = "select * from conversation_message m where m.conversation_id = :convId and m.text ~ :pattern",
            countQuery = "select count(m.id) from conversation_message m where m.conversation_id = :convId and m.text ~ :pattern"
            , nativeQuery = true)
    fun findAllMessagesByPattern(@Param("convId") conversationId: Long,
                                 @Param("pattern") searchPattern: String,
                                 pageable: Pageable): Page<ConversationMessage>

    @Query(value = "select * from conversation_message m where m.conversation_id = :convId and m.text like CONCAT('%', :pattern, '%')",
            countQuery = "select count(m.id) from conversation_message m where m.conversation_id = :convId and m.text like CONCAT('%', :pattern, '%')"
            , nativeQuery = true)
    fun findAllMessagesByString(@Param("convId") conversationId: Long,
                                @Param("pattern") searchPattern: String,
                                pageable: Pageable): Page<ConversationMessage>
}