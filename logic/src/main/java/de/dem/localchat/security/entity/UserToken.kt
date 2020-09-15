package de.dem.localchat.security.entity

import org.springframework.data.annotation.Id
import java.time.ZonedDateTime

data class UserToken(
        @Id
        val series: String,

        val username: String,

        val token: String,

        val lastUsed: ZonedDateTime
) {
}