package de.dem.localchat.security.entity

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import java.time.Instant

data class LoginToken(
        @Id
        val id: Long? = null,

        val token: String,

        val userId: Long,

        val description: String,

        val lastUsed: Instant = Instant.now(),

        @CreatedDate
        val createDate: Instant = Instant.now()
) {
}