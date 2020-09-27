package de.dem.localchat.dtos.requests

import java.time.Instant
import javax.validation.constraints.Positive
import javax.validation.constraints.PositiveOrZero

data class UserSearchRequest(
        val search: String
)
