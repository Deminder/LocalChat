package de.dem.localchat.dtos.requests

import java.time.Instant
import javax.validation.constraints.Positive
import javax.validation.constraints.PositiveOrZero

data class MessageSearchRequest(
        @field: PositiveOrZero
        val page: Int = 0,
        @field: Positive
        val pageSize: Int = 200,
        val olderThan: Instant = Instant.now(),
        val newerThan: Instant = Instant.EPOCH,
        val search: String? = null,
        val regex: Boolean = false
)
