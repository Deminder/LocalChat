package de.dem.localchat.dtos

data class MarkReadResponse(
    val member: MemberDto,
    val conversation: ConversationNameDto
)