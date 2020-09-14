package de.dem.localchat.conversation.service

import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission


interface MemberService {

    fun isMember(conversationId: Long, username: String, authority: String): Boolean

    fun updateLastRead(conversationMessageId: Long)

    /**
     * Change permission of user of specified userId.
     */
    fun permissionChange(conversationId: Long, userId: Long, newPermission: Permission): Member
    fun removeMember(conversationId: Long, userId: Long)

    /**
     * Get Permission object which represents the permissions the calling user is allowed to change.
     * Boolean fields indicate whether the author is allowed
     * to change the permission of its subject user with the specified userId.
     */
    fun allowedPermissionChange(conversationId: Long, userId: Long, newPermission: Permission): Permission


    /**
     * Whether the author user is allowed to delete the subject user with the specified userId.
     */
    fun allowedRemoval(conversationId: Long, userId: Long): Boolean
}