package de.dem.localchat.conversation.entity

import org.springframework.data.annotation.CreatedDate
import java.util.*
import javax.persistence.*

@Entity
data class Member(
        @Id
        val id: Long = -1,

        @ManyToOne(cascade = [CascadeType.REMOVE])
        val user: User = User(),

        @ManyToOne(cascade = [CascadeType.REMOVE])
        val conversation: Conversation = Conversation(),

        @Embedded
        val permission: Permission = Permission(),

        @CreatedDate
        val joinDate: Date = Date()) {
}