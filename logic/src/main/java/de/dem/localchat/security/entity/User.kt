package de.dem.localchat.security.entity

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import java.time.Instant

data class User(
        @Id
        val id: Long? = null,

        val username: String,

        val password: String,

        val enabled: Boolean = false,

        val authorities: Set<String> = emptySet(),

        @CreatedDate
        val registerDate: Instant = Instant.EPOCH
)