package de.dem.localchat.conversation.entity

import org.springframework.data.annotation.CreatedDate
import java.util.*
import javax.persistence.*

@Entity
data class Conversation(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = -1,

        @Column(nullable = false)
        val name: String = "New Conversation",

        @OneToMany(fetch = FetchType.LAZY)
        val members: Set<Member> = emptySet(),

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "conversation")
        val messages: List<ConversationMessage> = emptyList(),

        @CreatedDate
        val createDate: Date = Date()) {
}