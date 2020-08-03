package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.springframework.data.annotation.CreatedDate
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.OneToMany

@Entity
data class Conversation(

        @Column(nullable = false)
        val name: String = "New Conversation",

        @OneToMany(fetch = FetchType.LAZY)
        val members: Set<Member> = emptySet(),

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "conversation")
        val messages: List<ConversationMessage> = emptyList(),

        @CreatedDate
        val createDate: Date = Date()) : NumericIdentity() {
}