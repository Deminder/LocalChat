package de.dem.localchat.dtos

import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.model.ConversationMessagePage
import de.dem.localchat.security.entity.User
import java.time.Instant

fun Conversation.toConversationNameDto() = ConversationNameDto(
        id = id ?: -1,
        name = name,
        createDate = createDate.toEpochMilli(),
        lastUpdate = lastUpdate?.toEpochMilli() ?: 0
)

fun ConversationMessagePage.toConversationMessagePageDto() = ConversationMessagePageDto(
        convId = conversationId,
        page = page,
        pageSize = pageSize,
        last = last,
        olderThan = olderThan?.toEpochMilli(),
        newerThan = newerThan?.toEpochMilli(),
        search = search,
        regex = regex,
        messages = messages.map { message -> message.toConversationMessageDto() }
)

fun ConversationMessage.toConversationMessageDto() = ConversationMessageDto(
        id = id ?: -1,
        text = text,
        authorDate = authorDate.toEpochMilli(),
        lastChange = lastChange.toEpochMilli(),
        authorUserId = authorId
)


fun Member.toMemberDto(memberName: String) = MemberDto(
        userId = userId,
        username = memberName,
        convId = conversationId,
        permission = permission.toPermissionDto(),
        joinDate = joinDate.toEpochMilli()
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

fun User.toUserDts() = UserDts(
        id = id ?: -1,
        username = username,
        registerDate = registerDate.toEpochMilli()
)