package de.dem.localchat.dtos.requests

import de.dem.localchat.dtos.PermissionDto
import jakarta.validation.Valid

data class MemberUpdateRequest(
    val color: Int?,

    @field:Valid
    val permission: PermissionDto?,
)
