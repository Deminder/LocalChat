package de.dem.localchat.dtos

data class LoginTokenDto(
        val id: Long,
        val createDate: Long,
        val lastUsed: Long,
        val description: String,
)