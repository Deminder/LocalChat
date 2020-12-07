package de.dem.localchat.conversation.service

import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission


interface MemberService {

    /**
     * True if user is member of conversation and has at least one of the specified authorities
     */
    fun isMember(conversationId: Long, username: String, vararg authority: String): Boolean

    /**
     * Change permission of user of specified userId.
     */
    fun upsertMember(conversationId: Long, userId: Long, newPermission: Permission, color: Int?): Member
    fun removeMember(conversationId: Long, userId: Long)

    /**
     * Get Permission object which represents the permissions the calling user is allowed to change.
     * Boolean fields indicate whether the author is allowed
     * to change the permission of its subject user with the specified userId.
     */
    fun allowedPermissionChange(conversationId: Long, userId: Long): Permission


    /**
     * Whether the author user is allowed to delete the subject user with the specified userId.
     */
    fun allowedRemoval(conversationId: Long, userId: Long): Boolean

    fun memberName(cid: Long, userId: Long): String

    fun wroteMessage(cid: Long, username: String, messageId: Long): Boolean

    fun setColor(cid: Long, username: String, color: Int?): Member
}