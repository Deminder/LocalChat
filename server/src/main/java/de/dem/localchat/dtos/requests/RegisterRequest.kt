package de.dem.localchat.dtos.requests

import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size


data class RegisterRequest(

    @field: Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters.")
    @field: Pattern(
        regexp = "[A-z]([_\\-]?[A-z0-9])+", message = "Username must be alphanumerical." +
                "Underscores and Dashes are allowed."
    )
    val username: String,

    @field: Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters.")
    val password: String
)
