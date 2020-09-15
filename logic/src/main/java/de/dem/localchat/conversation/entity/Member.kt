package de.dem.localchat.conversation.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import de.dem.localchat.security.entity.User
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.relational.core.mapping.Embedded
import java.time.Instant

data class Member(

        val user: User,

        val conversation: Conversation,

        @Embedded.Nullable
        val permission: Permission,

        val lastRead: Instant = Instant.EPOCH,

        @CreatedDate
        val joinDate: Instant = Instant.EPOCH
) : NumericIdentity() {
}