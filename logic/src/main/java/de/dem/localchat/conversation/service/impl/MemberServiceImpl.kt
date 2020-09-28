package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.dataaccess.ConversationMessageRepository
import de.dem.localchat.conversation.dataaccess.ConversationRepository
import de.dem.localchat.conversation.dataaccess.MemberRepository
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.exception.ConversationException
import de.dem.localchat.conversation.service.MemberService
import de.dem.localchat.security.dataacess.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.Collections.max

@Service
class MemberServiceImpl(
        @Autowired val memberRepository: MemberRepository,
        @Autowired val conversationMessageRepository: ConversationMessageRepository,
        @Autowired val userRepository: UserRepository,
        @Autowired val conversationRepository: ConversationRepository,
) : MemberService {
    override fun isMember(conversationId: Long, username: String, vararg authority: String): Boolean =
            memberRepository.findByIdAndUsername(conversationId, username)
                    ?.permission?.let {
                        authority.any { auth ->
                            when (auth) {
                                "READ" -> it.read
                                "WRITE" -> it.write
                                "VOICE" -> it.voice
                                "MOD" -> it.moderate
                                "ADMIN" -> it.administrate
                                else -> false
                            }
                        }
                    } ?: false


    override fun updateLastRead(conversationMessageId: Long): Member =
            conversationMessageRepository.findById(conversationMessageId).orElseThrow {
                ConversationException("Conversation message does not exist!")
            }.let { message ->
                authorizedMember(message.conversationId)?.let { member ->
                    member.copy(
                            lastRead = max(listOf(member.lastRead, message.authorDate)))
                            .let {
                                memberRepository.save(member)
                            }
                }
            } ?: error("Failed updating last read!")

    /**
     * True if a member wrote a message and is still member of the conversation
     */
    override fun wroteMessage(cid: Long, username: String, messageId: Long) =
            authorizedMember(cid)?.let {
                conversationMessageRepository.findByIdAndAuthorId(messageId, it.userId) != null
            } ?: false


    private fun authorizedMember(cid: Long) = SecurityContextHolder.getContext().authentication?.let {
        memberRepository.findByIdAndUsername(cid, it.name)
    }

    /**
     * Find or create member. Creates an unsaved member if user not yet member of conversation.
     */
    private fun findOrCreateMember(cid: Long, userId: Long) =
            memberRepository.findByConvIdAndUserId(cid, userId) ?: if (userRepository.existsById(userId))
                Member(conversationId = cid, userId = userId) else
                error("User with id $userId does not exist!")


    private fun subjectAndAuthorPair(cid: Long, subjectId: Long) =
            authorizedMember(cid)?.let { author ->
                findOrCreateMember(cid, subjectId) to author
            } ?: error("Requesting user must be member of conversation $cid!")


    override fun upsertMember(conversationId: Long, userId: Long, newPermission: Permission): Member =
            subjectAndAuthorPair(conversationId, userId).let { (subject, author) ->
                subject.copy(
                        permission = writeNewPermission(subject.id == author.id,
                                subject.permission, newPermission, author.permission))
                        .let {
                            if (it.permission == newPermission)
                                if (adminMembersOf(conversationId).minus(subject).isNotEmpty())
                                    memberRepository.save(it)
                                else error("Choose next admin before removing the current!")
                            else error("Permission change failed due to lacking modification permission! " +
                                    "Expected $newPermission got ${it.permission}")
                        }
            }

    private fun adminMembersOf(conversationId: Long): Set<Member> =
            memberRepository.findByConversationId(conversationId).filter {
                it.permission.administrate
            }.toSet()


    override fun allowedPermissionChange(conversationId: Long, userId: Long) =
            subjectAndAuthorPair(conversationId, userId).let { (subject, author) ->
                modificationPermission(author.id == subject.id, subject.permission, author.permission)
            }


    private fun modificationPermission(selfSubject: Boolean, subjectPermission: Permission, authorPermission: Permission) =
            authorPermission.moderate.let { m ->
                authorPermission.administrate.let { a ->
                    Permission(read = m || a, write = m || a, voice = m || a,
                            // mods can not remove mods they added
                            moderate = (m && (selfSubject || !subjectPermission.moderate)) || a,
                            // admins can not remove admins they added
                            administrate = a && (selfSubject || !subjectPermission.administrate))

                }
            }

    private fun writeNewPermission(ss: Boolean,
                                   op: Permission,
                                   np: Permission,
                                   ap: Permission) = modificationPermission(ss, op, ap).let { cp ->
        Permission(
                read = (cp.read && np.read) || op.read,
                write = (cp.write && np.write) || op.write,
                voice = (cp.voice && np.voice) || op.voice,
                moderate = (cp.moderate && np.moderate) || op.moderate,
                administrate = (cp.administrate && np.administrate) || op.administrate)
    }


    override fun allowedRemoval(conversationId: Long, userId: Long) =
            subjectAndAuthorPair(conversationId, userId).let { (subject, author) ->
                removePermission(subject.id == author.id, subject.permission, author.permission)
            }

    override fun memberName(cid: Long, userId: Long) =
            userRepository.findByIdOrNull(userId)?.username ?: "[Unknown]"


    /**
     * Any user can remove themselves.
     * Admins can remove mods.
     * Mods can remove non-mods.
     */
    private fun removePermission(ss: Boolean, sp: Permission, ap: Permission) =
            ss || (!sp.administrate && (!sp.moderate || ap.administrate) && (ap.moderate || ap.administrate))


    override fun removeMember(conversationId: Long, userId: Long) {
        subjectAndAuthorPair(conversationId, userId).let { (subject, author) ->
            if (removePermission(subject.id == author.id, subject.permission, author.permission)) {
                if (adminMembersOf(conversationId).minus(subject).isNotEmpty()
                        || memberRepository.countByConversationId(conversationId) == 1)
                    memberRepository.delete(subject)
                else error("Remove all members before removing the admin!")
            }
        }.run {
            // clean up conversation if no members left
            if (memberRepository.countByConversationId(conversationId) == 0) {
                conversationRepository.deleteById(conversationId)
            }
        }
    }
}