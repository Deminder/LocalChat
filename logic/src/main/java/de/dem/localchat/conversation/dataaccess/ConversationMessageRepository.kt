package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.ConversationMessage
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.Instant

const val BASE_QUERY = "SELECT m.* FROM conversation_message m WHERE" +
        "AND m.author_date > :olderThan AND m.author_date < :newerThan"

@Repository
interface ConversationMessageRepository : PagingAndSortingRepository<ConversationMessage, Long> {


    fun findAllByConversationId(conversationId: Long, pageable: Pageable): Page<ConversationMessage>

    @Query(BASE_QUERY)
    fun findAllByConversationIdBetween(conversationId: Long,
                                       olderThan: Instant,
                                       newerThan: Instant,
                                       pageable: Pageable): Page<ConversationMessage>

    @Query(BASE_QUERY + "m.conversation_id = :cid AND m.text ~ :searchPattern")
    fun findAllMessagesByPattern(@Param("cid") conversationId: Long,
                                 olderThan: Instant,
                                 newerThan: Instant,
                                 searchPattern: String,
                                 pageable: Pageable): Page<ConversationMessage>

    @Query(BASE_QUERY +
            "m.conversation_id = :cid AND m.text LIKE CONCAT('%', :searchPattern, '%')")
    fun findAllMessagesByString(@Param("cid") conversationId: Long,
                                olderThan: Instant,
                                newerThan: Instant,
                                searchPattern: String,
                                pageable: Pageable): Page<ConversationMessage>
}