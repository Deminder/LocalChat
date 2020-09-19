package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.dataaccess.ConversationMessageRepository
import de.dem.localchat.conversation.dataaccess.ConversationRepository
import de.dem.localchat.conversation.dataaccess.MemberRepository
import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.model.ConversationMessagePage
import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.security.dataacess.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class ConversationServiceImpl(
        @Autowired private val conversationRepository: ConversationRepository,
        @Autowired private val memberRepository: MemberRepository,
        @Autowired private val userRepository: UserRepository,
        @Autowired private val conversationMessageRepository: ConversationMessageRepository
) : ConversationService {

    override fun conversationsByUserName(userName: String): List<Conversation> =
            conversationRepository.findAllByUsername(userName)


    override fun membersOfConversation(conversationId: Long): List<Member> =
            memberRepository.findByConversationId(conversationId)


    override fun changeConversationName(conversationId: Long, newName: String) =
            conversationRepository.findByIdOrNull(conversationId)?.let {
                conversationRepository.save(it.copy(name = newName))
            } ?: error("No such conversation!")


    private fun descDate(page: Int, pageSize: Int) =
            PageRequest.of(page, pageSize, Sort.by("authorDate").descending())

    override fun conversationMessagePage(conversationId: Long, page: Int, pageSize: Int,
                                         olderThan: Instant,
                                         newerThan: Instant,
                                         search: String?,
                                         regex: Boolean) =
            descDate(page, pageSize).let { pageRequest ->
                if (search == null)
                    conversationMessageRepository.findAllByConversationIdBetween(
                            conversationId, olderThan, newerThan, pageRequest)
                else (if (regex)
                    conversationMessageRepository::findAllMessagesByPattern
                else conversationMessageRepository::findAllMessagesByString)
                        .invoke(conversationId, olderThan, newerThan, search, pageRequest)

            }.let {
                ConversationMessagePage(
                        conversationId = conversationId,
                        page = page,
                        pageSize = pageSize,
                        olderThan = olderThan,
                        last = it.isLast,
                        messages = it.content
                )
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