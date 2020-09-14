package de.dem.localchat.dtos.requests

import de.dem.localchat.dtos.PermissionDto
import javax.validation.Valid
import javax.validation.constraints.Size

data class MemberUpdateRequest(
        val conversationId: Long,
        @field:Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters")
        val memberName: String,

        @field:Valid
        val permission: PermissionDto,
) {

}
