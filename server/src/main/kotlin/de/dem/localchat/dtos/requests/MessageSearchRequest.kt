package de.dem.localchat.dtos.requests

import java.time.Instant
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.PositiveOrZero

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
