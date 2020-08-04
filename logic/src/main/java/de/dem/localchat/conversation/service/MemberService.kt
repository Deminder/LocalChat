package de.dem.localchat.conversation.service


interface MemberService {

    fun isMember(conversationId: Long, username: String, authority: String): Boolean

    fun updateLastRead(conversationMessageId: Long)
}