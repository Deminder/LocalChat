package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant

data class ConversationMessage(
        val text: String,

        val author: Member,

        val conversation: Conversation,

        @CreatedDate
        val authorDate: Instant,

        @LastModifiedDate
        val lastChange: Instant
) : NumericIdentity() {
}
