package de.dem.localchat.dtos

data class ConversationMembersDto(
    val id: Long,
    val members: List<MemberDto>
) {

}
