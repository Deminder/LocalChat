package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import de.dem.localchat.security.entity.User
import org.springframework.data.annotation.CreatedDate
import java.util.*
import javax.persistence.*

@Entity
data class Member(

        @ManyToOne(cascade = [CascadeType.REMOVE])
        val user: User = User(),

        @ManyToOne(cascade = [CascadeType.REMOVE])
        val conversation: Conversation = Conversation(),

        @Embedded
        val permission: Permission = Permission(),

        @CreatedDate
        val joinDate: Date = Date()) : NumericIdentity() {
}