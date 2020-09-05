package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime
import java.time.ZonedDateTime
import javax.persistence.Entity
import javax.persistence.ManyToOne

@Entity
data class ConversationMessage(
        val text: String,

        @ManyToOne
        val author: Member,

        @ManyToOne
        val conversation: Conversation,

        @CreatedDate
        val authorDate: ZonedDateTime,

        @LastModifiedDate
        val lastChange: ZonedDateTime
) : NumericIdentity() {
}
