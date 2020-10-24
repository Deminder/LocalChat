package de.dem.localchat.dtos.requests

import java.time.Instant
import javax.validation.constraints.Max
import javax.validation.constraints.Positive
import javax.validation.constraints.PositiveOrZero

data class MessageSearchRequest(
        @field: PositiveOrZero
        val page: Int = 0,
        @field: Positive
        @field: Max(4096)
        val pageSize: Int = 30,
        @field: PositiveOrZero
        val olderThan: Long = Instant.now().toEpochMilli(),
        @field: PositiveOrZero
        val newerThan: Long = 0,
        val search: String? = null,
        val regex: Boolean? = null
)
