package de.dem.localchat.conversation.entity

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Embedded
import java.time.Instant

data class Member(
        @Id
        val id: Long? = null,

        val userId: Long,

        val conversationId: Long,

        val color: Int? = null,

        @Embedded.Empty
        val permission: Permission = Permission(),

        val lastRead: Instant = Instant.EPOCH,

        @CreatedDate
        val joinDate: Instant = Instant.EPOCH
)