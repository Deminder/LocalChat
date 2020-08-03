package de.dem.localchat.dtos

import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.model.ConversationMessageBatch

fun Conversation.toConversationNameDto() = ConversationNameDto(
        id = id,
        name = name
)

fun Conversation.toConversationMembersDto() = ConversationMembersDto(
    id = id,
    members = members.map { member: Member ->  member.toMemberDto() }
)

fun ConversationMessageBatch.toConversationMessageBatchDto() = ConversationMessageBatchDto(
        convId = conversation.id,
        offset = offset,
        last = last,
        messages = messages.map { message -> message.toConversationMessageDto() }
)

fun ConversationMessage.toConversationMessageDto() = ConversationMessageDto(
        id = id,
        text = text,
        authorDate = authorDate,
        lastChange = lastChange,
        authorName = author.user.username
)

fun Member.toMemberDto() = MemberDto(
        name = user.username,
        convId = conversation.id,
        permission = Permission().toPermissionDto(),
        joinDate = joinDate
)

fun Permission.toPermissionDto() = PermissionDto(
        read = read,
        write = read,
        voice = voice,
        moderate = moderate,
        administrate = administrate
)