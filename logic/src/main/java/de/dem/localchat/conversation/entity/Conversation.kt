package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
data class Conversation(

        @Column(nullable = false)
        val name: String,

        @CreatedBy
        var creator: String = "",

        @CreatedDate
        var createDate: Instant = Instant.EPOCH

) : NumericIdentity() {
        @OneToMany(fetch = FetchType.LAZY, mappedBy = "conversation")
        var members: Set<Member> = emptySet()

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "conversation")
        var messages: List<ConversationMessage> = emptyList()
}