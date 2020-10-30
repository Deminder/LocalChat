package de.dem.localchat.conversation.dataaccess

import de.dem.localchat.conversation.entity.ConversationMessage
import org.springframework.data.domain.Pageable
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.Instant

const val BASE_QUERY = "SELECT m.* FROM conversation_message m WHERE " +
        "m.conversation_id = :conversationId AND m.author_date < :olderThan AND m.author_date > :newerThan"

const val SORT_QUERY = "ORDER BY m.author_date DESC LIMIT :limit OFFSET :offset"

@Repository
interface ConversationMessageRepository : PagingAndSortingRepository<ConversationMessage, Long> {


    fun findAllByConversationId(conversationId: Long, pageable: Pageable): List<ConversationMessage>

    @Query("$BASE_QUERY $SORT_QUERY")
    fun findAllByConversationIdBetween(conversationId: Long,
                                       olderThan: Instant,
                                       newerThan: Instant,
                                       limit: Int,
                                       offset: Int): List<ConversationMessage>

    @Query("$BASE_QUERY AND m.text ~ :searchPattern $SORT_QUERY")
    fun findAllMessagesByPattern(conversationId: Long,
                                 olderThan: Instant,
                                 newerThan: Instant,
                                 searchPattern: String,
                                 limit: Int,
                                 offset: Int): List<ConversationMessage>

    @Query("$BASE_QUERY AND m.text LIKE CONCAT('%', :searchPattern, '%') $SORT_QUERY")
    fun findAllMessagesByString(conversationId: Long,
                                olderThan: Instant,
                                newerThan: Instant,
                                searchPattern: String,
                                limit: Int,
                                offset: Int): List<ConversationMessage>

    fun findByIdAndAuthorId(messageId: Long, authorId: Long): ConversationMessage?


    fun findByIdAndConversationId(messageId: Long, conversationId: Long): ConversationMessage?

    @Query("SELECT COUNT(m.id) " +
            "FROM conversation_message m, member mem WHERE mem.user_id = :uid " +
            "AND mem.conversation_id = m.conversation_id AND m.conversation_id = :cid " +
            "AND mem.last_read < m.author_date")
    fun countUnreadMessagesOfMember(@Param("uid") userId: Long, @Param("cid") conversationId: Long): Int
}