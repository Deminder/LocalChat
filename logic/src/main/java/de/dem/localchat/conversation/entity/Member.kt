package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import de.dem.localchat.security.entity.User
import org.springframework.data.annotation.CreatedDate
import java.time.LocalDateTime
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.CascadeType
import javax.persistence.Embedded
import javax.persistence.Entity
import javax.persistence.ManyToOne

@Entity
data class Member(

        @ManyToOne(cascade = [CascadeType.REMOVE])
        val user: User,

        @ManyToOne(cascade = [CascadeType.REMOVE])
        val conversation: Conversation,

        @Embedded
        val permission: Permission,

        var lastRead: ZonedDateTime,

        @CreatedDate
        val joinDate: ZonedDateTime) : NumericIdentity() {
}