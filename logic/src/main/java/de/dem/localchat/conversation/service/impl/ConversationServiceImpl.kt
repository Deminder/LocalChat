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

    override fun getConversation(conversationId: Long) =
            memberRepository.findByIdAndUsername(conversationId, username())?.let {
                conversationRepository.findConvById(conversationId)
            }


    override fun listConversations(): List<Conversation> =
            conversationRepository.findAllByUser(uid())


    override fun membersOfConversation(conversationId: Long): List<Member> =
            memberRepository.findAllByConversationId(conversationId)


    override fun changeConversationName(conversationId: Long, newName: String) =
            conversationRepository.findConvById(conversationId)?.let {
                conversationRepository.save(it.copy(name = newName))
            } ?: error("No such conversation!")


    override fun upsertMessage(conversationId: Long, messageId: Long?, text: String): ConversationMessage =
            userRepository.findByUsername(username())?.id!!.let { authorId ->
                (if (messageId == null)
                    ConversationMessage(authorId = authorId, conversationId = conversationId)
                // only author can edit message
                else conversationMessageRepository.findByIdAndAuthorId(messageId, authorId)
                        )?.let {
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
            (if (search == null)
                conversationMessageRepository.findAllByConversationIdBetween(
                        conversationId, olderThan, newerThan, pageSize, page * pageSize)
            else (if (regex == true)
                conversationMessageRepository::findAllMessagesByPattern
            else conversationMessageRepository::findAllMessagesByString)
                    .invoke(conversationId, olderThan, newerThan, search, pageSize, page * pageSize)
                    ).let {
                        ConversationMessagePage(
                                last = it.size < pageSize,
                                messages = it,
                        )
                    }

    override fun countUnreadMessages(conversationId: Long): Int =
            conversationMessageRepository.countUnreadMessagesOfMember(uid(), conversationId)


    override fun memberReadsConversation(conversationId: Long) {
        memberRepository.findByConvIdAndUserId(conversationId, uid())?.let {
            memberRepository.save(it.copy(lastRead = Instant.now()))
        } ?: error("Member not found!")
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

    private fun uid(): Long = uid(username())!!
    private fun uid(name: String): Long? = (userRepository.findByUsername(name) ?: error("User not found!")).id

    private fun username() = SecurityContextHolder.getContext().authentication?.name
            ?: error("Not logged in!")
}

