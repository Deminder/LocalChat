package de.dem.localchat.dtos.requests

import java.time.Instant
import javax.validation.constraints.Positive
import javax.validation.constraints.PositiveOrZero

data class MessageSearchRequest(
        @field: PositiveOrZero
        val page: Int = 0,
        @field: Positive
        val pageSize: Int = 200,
        val olderThan: Long = Instant.now().toEpochMilli(),
        val newerThan: Long = 0,
        val search: String? = null,
        val regex: Boolean = false
)
