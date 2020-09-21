package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.ConversationMessage
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.Instant

const val BASE_QUERY = "SELECT m.* FROM conversation_message m WHERE " +
        "m.conversation_id = :conversationId AND m.author_date < :olderThan AND m.author_date > :newerThan"
// TODO add ' '

@Repository
interface ConversationMessageRepository : PagingAndSortingRepository<ConversationMessage, Long> {


    fun findAllByConversationId(conversationId: Long, pageable: Pageable): List<ConversationMessage>

    @Query(BASE_QUERY)
    fun findAllByConversationIdBetween(conversationId: Long,
                                       olderThan: Instant,
                                       newerThan: Instant,
                                       pageable: Pageable): List<ConversationMessage>

    @Query("$BASE_QUERY AND m.text ~ :searchPattern")
    fun findAllMessagesByPattern(conversationId: Long,
                                 olderThan: Instant,
                                 newerThan: Instant,
                                 searchPattern: String,
                                 pageable: Pageable): List<ConversationMessage>

    @Query("$BASE_QUERY AND m.text LIKE CONCAT('%', :searchPattern, '%')")
    fun findAllMessagesByString(conversationId: Long,
                                olderThan: Instant,
                                newerThan: Instant,
                                searchPattern: String,
                                pageable: Pageable): List<ConversationMessage>

    fun findByIdAndAuthorId(messageId: Long, authorId: Long): ConversationMessage?


    fun findByIdAndConversationId(messageId: Long, conversationId: Long): ConversationMessage?
}