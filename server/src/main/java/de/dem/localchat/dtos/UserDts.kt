package de.dem.localchat.dtos

import java.time.Instant

data class UserDts(
        val id: Long,
        val username: String,
        val registerDate: Instant)
