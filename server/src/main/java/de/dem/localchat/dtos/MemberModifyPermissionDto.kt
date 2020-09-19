package de.dem.localchat.dtos

data class MemberModifyPermissionDto(
        val modify: PermissionDto,
        val delete: Boolean
)
