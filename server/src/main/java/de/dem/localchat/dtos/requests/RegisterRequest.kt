package de.dem.localchat.dtos.requests

import javax.validation.constraints.Pattern
import javax.validation.constraints.Size


data class RegisterRequest(

        @field: Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters.")
        @field: Pattern(regexp = "\\w+", message = "Username must be alpha numerical.")
        var username: String,

        @field: Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters.")
        var password: String
)
