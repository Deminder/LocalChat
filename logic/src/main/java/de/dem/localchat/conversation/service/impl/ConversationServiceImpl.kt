package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.dataaccess.ConversationMessageRepository
import de.dem.localchat.conversation.dataaccess.ConversationRepository
import de.dem.localchat.conversation.dataaccess.MemberRepository
import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.service.ConversationService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class ConversationServiceImpl(
        @Autowired private val conversationRepository: ConversationRepository,
        @Autowired private val memberRepository: MemberRepository,
        @Autowired private val conversationMessageRepository: ConversationMessageRepository
) : ConversationService {
    override fun allConversationsByUserName(userName: String): List<Conversation> {
        return conversationRepository.findAllByUsername(userName)
    }

    override fun allMembersOfConversation(conversationId: Long): List<Member> {
        return memberRepository.findByConversationId(conversationId)
    }

    private fun descDate(page: Int, pageSize: Int): Pageable {
        return PageRequest.of(page, pageSize, Sort.by("authorDate").descending())
    }

    override fun conversationMessagePage(conversationId: Long, page: Int, pageSize: Int): Page<ConversationMessage> {
        return conversationMessageRepository.findAllByConversationId(conversationId, descDate(page, pageSize))
    }

    override fun searchConversationMessages(conversationId: Long, searchPattern: String, regex: Boolean, page: Int, pageSize: Int): Page<ConversationMessage> {
        return when (regex) {
            true -> conversationMessageRepository::findAllMessagesByPattern
            false -> conversationMessageRepository::findAllMessagesByString
        }.invoke(conversationId, searchPattern, descDate(page, pageSize))
    }

}