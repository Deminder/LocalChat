package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class ConversationMessage(
        val text: String = "",

        @ManyToOne
        val author: Member = Member(),

        @ManyToOne
        val conversation: Conversation = Conversation(),

        @CreatedDate
        val authorDate: LocalDateTime = LocalDateTime.now(),

        @LastModifiedDate
        val lastChange: LocalDateTime = LocalDateTime.now()
)  : NumericIdentity(){
}
