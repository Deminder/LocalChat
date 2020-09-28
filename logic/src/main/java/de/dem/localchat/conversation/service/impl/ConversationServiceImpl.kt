package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.dataaccess.ConversationMessageRepository
import de.dem.localchat.conversation.dataaccess.ConversationRepository
import de.dem.localchat.conversation.dataaccess.MemberRepository
import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.model.ConversationMessagePage
import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.security.dataacess.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class ConversationServiceImpl(
        @Autowired val conversationRepository: ConversationRepository,
        @Autowired val memberRepository: MemberRepository,
        @Autowired val userRepository: UserRepository,
        @Autowired val conversationMessageRepository: ConversationMessageRepository
) : ConversationService {

    override fun listConversations(): List<Conversation> =
            conversationRepository.findAllByUsername(username())


    override fun membersOfConversation(conversationId: Long): List<Member> =
            memberRepository.findByConversationId(conversationId)


    override fun changeConversationName(conversationId: Long, newName: String) =
            conversationRepository.findByIdOrNull(conversationId)?.let {
                conversationRepository.save(it.copy(name = newName))
            } ?: error("No such conversation!")


    private fun descDate(page: Int, pageSize: Int) =
            PageRequest.of(page, pageSize, Sort.by("authorDate").descending())


    override fun upsertMessage(conversationId: Long, messageId: Long?, text: String): ConversationMessage =
            userRepository.findByUsername(username())?.id!!.let { authorId ->
                (if (messageId == null)
                    ConversationMessage(authorId = authorId, conversationId = conversationId)
                // only author can edit message
                else conversationMessageRepository.findByIdAndAuthorId(messageId, authorId))?.let {
                    conversationMessageRepository.save(it.copy(
                            text = text
                    ))
                } ?: error("Requesting user did not author message $messageId!")
            }

    override fun deleteMessage(conversationId: Long, messageId: Long) =
            conversationMessageRepository.findByIdAndConversationId(messageId, conversationId)?.let {
                conversationMessageRepository.delete(it)
            } ?: error("Message $messageId not found in conversation $conversationId!")


    override fun conversationMessagePage(conversationId: Long, page: Int, pageSize: Int,
                                         olderThan: Instant,
                                         newerThan: Instant,
                                         search: String?,
                                         regex: Boolean?) =
            descDate(page, pageSize).let { pageRequest ->
                if (search == null)
                    conversationMessageRepository.findAllByConversationIdBetween(
                            conversationId, olderThan, newerThan, pageRequest)
                else (if (regex == true)
                    conversationMessageRepository::findAllMessagesByPattern
                else conversationMessageRepository::findAllMessagesByString)
                        .invoke(conversationId, olderThan, newerThan, search, pageRequest)

            }.let {
                ConversationMessagePage(
                        conversationId = conversationId,
                        page = page,
                        pageSize = pageSize,
                        olderThan = olderThan,
                        newerThan = newerThan,
                        // it should be Pageable<Type> once spring data jdbc supports pageable return values
                        last = it.size < pageSize,
                        messages = it,
                        search = search,
                        regex = regex
                )
            }

    override fun createConversation(conversationName: String,
                                    memberNames: Set<String>): Conversation =
            username().let { adminName ->
                Conversation(
                        name = conversationName
                                .ifBlank {
                                    "$adminName ↹ ${memberNames.joinToString(",")}"
                                }
                ).let {
                    conversationRepository.save(it).copy(lastUpdate = Instant.now())
                }.also {
                    memberNames.plus(adminName)
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

    private fun username() = SecurityContextHolder.getContext().authentication?.name
            ?: error("Not logged in!")
}