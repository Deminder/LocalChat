package de.dem.localchat.dtos

import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.model.ConversationMessagePage
import de.dem.localchat.dtos.requests.MessageSearchRequest
import de.dem.localchat.security.entity.LoginToken
import de.dem.localchat.security.entity.User

fun Conversation.toConversationNameDto(unreadCount: Int) = ConversationNameDto(
        id = id ?: -1,
        name = name,
        createDate = createDate.toEpochMilli(),
        lastUpdate = lastUpdate?.toEpochMilli() ?: 0,
        unreadCount = unreadCount
)

fun ConversationMessagePage.toConversationMessagePageDto(convId: Long, r: MessageSearchRequest) = ConversationMessagePageDto(
        convId = convId,
        request = r,
        last = last,
        messages = messages.map { message -> message.toConversationMessageDto() }
)

fun ConversationMessage.toConversationMessageDto() = ConversationMessageDto(
        id = id ?: -1,
        text = text,
        authorDate = authorDate.toEpochMilli(),
        lastChange = lastChange.toEpochMilli(),
        authorUserId = authorId
)


fun Member.toMemberDto(memberName: String, modifyPermissionDto: MemberModifyPermissionDto) = MemberDto(
        userId = userId,
        username = memberName,
        convId = conversationId,
        modifiablePermission = modifyPermissionDto,
        permission = permission.toPermissionDto(),
        color = color,
        joinDate = joinDate.toEpochMilli()
)

fun Permission.toPermissionDto() = PermissionDto(
        read = read,
        write = write,
        voice = voice,
        moderate = moderate,
        administrate = administrate
)

fun PermissionDto.toPermission() = Permission(
        read = read,
        write = write,
        voice = voice,
        moderate = moderate,
        administrate = administrate
)

fun User.toUserDts() = UserDto(
        id = id ?: -1,
        username = username,
        registerDate = registerDate.toEpochMilli()
)


fun LoginToken.toLoginTokenDto() = LoginTokenDto(
        id = id ?: -1,
        createDate = createDate.toEpochMilli(),
        lastUsed = lastUsed.toEpochMilli(),
        description = description
)