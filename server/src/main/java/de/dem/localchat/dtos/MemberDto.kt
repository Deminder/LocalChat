package de.dem.localchat.dtos

import java.time.Instant


data class MemberDto(
        val userId: Long,
        val username: String,
        val convId: Long,
        val permission: PermissionDto,
        val joinDate: Instant
)

