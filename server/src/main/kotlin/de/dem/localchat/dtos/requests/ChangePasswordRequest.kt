package de.dem.localchat.dtos.requests

import jakarta.validation.constraints.Size


data class ChangePasswordRequest(
    @field: Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters.")
    val password: String,
    val oldPassword: String,
)
