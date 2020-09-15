package de.dem.localchat.security.entity

import java.time.Instant

data class UserToken(

        val series: String,

        val username: String,

        val token: String,

        val lastUsed: Instant
) {
}