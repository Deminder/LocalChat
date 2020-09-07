package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import java.time.LocalDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.OneToMany

@Entity
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