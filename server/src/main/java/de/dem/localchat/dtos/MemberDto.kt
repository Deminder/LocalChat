package de.dem.localchat.dtos

import java.time.ZonedDateTime


data class MemberDto(
        val name: String,
        val convId: Long,
        val permission: PermissionDto,
        val joinDate: ZonedDateTime
)

