package de.dem.localchat.conversation.entity

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class ConversationMessage(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = -1,

        val text: String = "",

        @ManyToOne
        val author: Member = Member(),

        @ManyToOne
        val conversation: Conversation = Conversation(),

        @CreatedDate
        val authorDate: LocalDateTime = LocalDateTime.now(),

        @LastModifiedDate
        val lastChange: LocalDateTime = LocalDateTime.now()
) {
}
