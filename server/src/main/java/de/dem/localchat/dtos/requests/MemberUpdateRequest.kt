package de.dem.localchat.dtos.requests

import de.dem.localchat.dtos.PermissionDto
import javax.validation.Valid
import javax.validation.constraints.Size

data class MemberUpdateRequest(
        val color: Int?,

        @field:Valid
        val permission: PermissionDto?,
)
