package de.dem.localchat.dtos

import java.util.*


data class MemberDto(
        val name: String,
        val convId: Long,
        val permission: PermissionDto,
        val joinDate: Date
)

