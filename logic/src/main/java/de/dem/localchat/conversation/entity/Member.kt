package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import de.dem.localchat.security.entity.User
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
data class Member(

        @ManyToOne(cascade = [CascadeType.REMOVE])
        val user: User,

        @ManyToOne(cascade = [CascadeType.REMOVE])
        val conversation: Conversation,

        @Embedded
        val permission: Permission,

        var lastRead: Instant,

        @CreatedDate
        val joinDate: Instant
) : NumericIdentity() {
}