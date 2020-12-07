package de.dem.localchat.dtos



data class MemberDto(
        val userId: Long,
        val username: String,
        val convId: Long,
        val permission: PermissionDto,
        val color: String?,
        val modifiablePermission: MemberModifyPermissionDto,
        val joinDate: Long
)

