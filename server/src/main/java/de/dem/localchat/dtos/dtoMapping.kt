package de.dem.localchat.dtos

import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.model.ConversationMessagePage

fun Conversation.toConversationNameDto() = ConversationNameDto(
        id = id,
        name = name,
        createDate = createDate
)

fun Conversation.toConversationMembersDto() = ConversationMembersDto(
        id = id,
        members = members.map { member: Member -> member.toMemberDto() }
)

fun ConversationMessagePage.toConversationMessageBatchDto() = ConversationMessagePageDto(
        convId = conversationId,
        page = page,
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
        userId = user.id,
        username = user.username,
        convId = conversation.id,
        permission = permission.toPermissionDto(),
        joinDate = joinDate
)

fun Permission.toPermissionDto() = PermissionDto(
        read = read,
        write = read,
        voice = voice,
        moderate = moderate,
        administrate = administrate
)

fun PermissionDto.toPermission() = Permission(
        read = read,
        write = read,
        voice = voice,
        moderate = moderate,
        administrate = administrate
)