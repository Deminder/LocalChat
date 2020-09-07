package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
data class Conversation(

        @Column(nullable = false)
        val name: String,

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "conversation")
        val members: Set<Member>,

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "conversation")
        val messages: List<ConversationMessage>,

        @CreatedBy
        val creator: String,

        @CreatedDate
        val createDate: LocalDateTime) : NumericIdentity() {
}