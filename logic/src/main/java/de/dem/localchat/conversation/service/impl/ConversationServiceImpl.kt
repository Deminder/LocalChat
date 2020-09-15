package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.dataaccess.ConversationMessageRepository
import de.dem.localchat.conversation.dataaccess.ConversationRepository
import de.dem.localchat.conversation.dataaccess.MemberRepository
import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.security.dataacess.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ConversationServiceImpl(
        @Autowired private val conversationRepository: ConversationRepository,
        @Autowired private val memberRepository: MemberRepository,
        @Autowired private val userRepository: UserRepository,
        @Autowired private val conversationMessageRepository: ConversationMessageRepository
) : ConversationService {

    override fun conversationsByUserName(userName: String): List<Conversation> {
        return conversationRepository.findAllByUsername(userName)
    }

    override fun membersOfConversation(conversationId: Long): List<Member> {
        return memberRepository.findByConversationId(conversationId)
    }

    override fun changeConversationName(conversationId: Long, newName: String) =
            conversationRepository.findByIdOrNull(conversationId)?.let {
                conversationRepository.save(it.copy(name = newName))
            } ?: error("No such conversation!")


    private fun descDate(page: Int, pageSize: Int): Pageable {
        return PageRequest.of(page, pageSize, Sort.by("authorDate").descending())
    }

    override fun conversationMessagePage(conversationId: Long, page: Int, pageSize: Int): Page<ConversationMessage> {
        return conversationMessageRepository.findAllByConversationId(conversationId, descDate(page, pageSize))
    }

    override fun searchConversationMessages(conversationId: Long,
                                            searchPattern: String,
                                            regex: Boolean,
                                            page: Int,
                                            pageSize: Int): Page<ConversationMessage> {
        return when (regex) {
            true -> conversationMessageRepository::findAllMessagesByPattern
            false -> conversationMessageRepository::findAllMessagesByString
        }.invoke(conversationId, searchPattern, descDate(page, pageSize))
    }

    override fun createConversation(adminName: String,
                                    conversationName: String,
                                    memberNames: Set<String>): Conversation =
            Conversation(
                    name = conversationName
                            .ifBlank {
                                "$adminName ↹ ${memberNames.joinToString(",")}"
                            })
                    .let {
                        conversationRepository.save(it)
                    }.also {
                        memberNames
                                .plus(adminName)
                                .mapNotNull { memberName ->
                                    userRepository.findByUsername(memberName)?.let { user ->
                                        Member(
                                                conversationId = it.id!!,
                                                userId = user.id!!,
                                                permission = Permission(
                                                        read = true, write = true, voice = true,
                                                        moderate = memberName == adminName,
                                                        administrate = memberName == adminName)
                                        )
                                    }
                                }.let {
                                    memberRepository.saveAll(it)
                                }
                    }

}