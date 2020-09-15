package de.dem.localchat.conversation.entity

import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import java.time.Instant

data class Conversation(
        @Id
        val id: Long? = null,

        val name: String,

        @CreatedBy
        val creator: String = "",

        @CreatedDate
        val createDate: Instant = Instant.EPOCH
)