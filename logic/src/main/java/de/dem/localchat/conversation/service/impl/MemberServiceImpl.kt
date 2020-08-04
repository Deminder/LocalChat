package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.dataaccess.ConversationMessageRepository
import de.dem.localchat.conversation.dataaccess.MemberRepository
import de.dem.localchat.conversation.exception.ConversationException
import de.dem.localchat.conversation.service.MemberService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class MemberServiceImpl(
        @Autowired private val memberRepository: MemberRepository,
        @Autowired private val conversationMessageRepository: ConversationMessageRepository
) : MemberService {
    override fun isMember(conversationId: Long, username: String, authority: String): Boolean {
        return memberRepository.findByConversationIdAndUserUsername(conversationId, username)
                ?.permission?.let {
                    return@let when (authority) {
                        "READ" -> it.read
                        "WRITE" -> it.write
                        "VOICE" -> it.voice
                        "MOD" -> it.moderate
                        "ADMIN" -> it.administrate
                        else -> false
                    }
                } ?: false
    }

    override fun updateLastRead(conversationMessageId: Long) {
        conversationMessageRepository.findById(conversationMessageId).orElseThrow {
            ConversationException("Conversation message does not exist!")
        }.let { message ->
            memberRepository.findByConversationIdAndUserUsername(
                    message.conversation.id, SecurityContextHolder.getContext().authentication.name
            )?.let { member ->
                member.lastRead = listOf(member.lastRead, message.authorDate).max()!!
                memberRepository.save(member)
            }

        }
    }
}