package de.dem.localchat.conversation.entity

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant

data class ConversationMessage(
        @Id
        val id: Long? = null,

        val text: String = "",

        val authorId: Long,

        val conversationId: Long,

        @CreatedDate
        val authorDate: Instant = Instant.EPOCH,

        @LastModifiedDate
        val lastChange: Instant = Instant.EPOCH
)
