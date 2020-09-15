package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.dataaccess.ConversationMessageRepository
import de.dem.localchat.conversation.dataaccess.MemberRepository
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.exception.ConversationException
import de.dem.localchat.conversation.service.MemberService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.Collections.max

@Service
class MemberServiceImpl(
        @Autowired private val memberRepository: MemberRepository,
        @Autowired private val conversationMessageRepository: ConversationMessageRepository
) : MemberService {
    override fun isMember(conversationId: Long, username: String, authority: String): Boolean {
        return memberRepository.findByIdAndUsername(conversationId, username)
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
            authorizedMember(message.conversation.id)?.let { member ->
                member.copy(
                        lastRead = max(listOf(member.lastRead, message.authorDate)))
                        .let {
                            memberRepository.save(member)
                        }
            }

        }
    }

    private fun authorizedMember(cid: Long) = SecurityContextHolder.getContext().authentication?.let {
        memberRepository.findByIdAndUsername(cid, it.name)
    }

    private fun subjectAndAuthorPair(cid: Long, subjectId: Long) =
            authorizedMember(cid)?.let { author ->
                memberRepository.findByConversationIdAndUserId(cid, subjectId)?.let { subject ->
                    Pair(author, subject)
                }
            }


    override fun permissionChange(conversationId: Long, userId: Long, newPermission: Permission) =
            subjectAndAuthorPair(conversationId, userId)?.let { (author, subject) ->
                subject.copy(
                        permission = writeNewPermission(subject.id == author.id,
                                subject.permission, newPermission, author.permission))
                        .let {
                            memberRepository.save(it)
                        }
            } ?: error("Failed to update member!")


    override fun allowedPermissionChange(conversationId: Long, userId: Long, newPermission: Permission) =
            subjectAndAuthorPair(conversationId, userId)?.let { (author, subject) ->
                changePermission(author.id == subject.id, subject.permission, author.permission)
            } ?: Permission()


    private fun changePermission(selfSubject: Boolean, subjectPermission: Permission, authorPermission: Permission) =
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
                                   ap: Permission) = changePermission(ss, op, ap).let { cp ->
        Permission(
                read = (cp.read && np.read) || op.read,
                write = (cp.write && np.write) || op.write,
                voice = (cp.voice && np.voice) || op.voice,
                moderate = (cp.moderate && np.moderate) || op.moderate,
                administrate = (cp.administrate && np.administrate) || op.administrate)
    }


    override fun allowedRemoval(conversationId: Long, userId: Long) =
            subjectAndAuthorPair(conversationId, userId)?.let { (author, subject) ->
                removePermission(subject.id == author.id, subject.permission, author.permission)
            } ?: false

    /**
     * Any user can remove themselves.
     * Admins can remove mods.
     * Mods can remove non-mods.
     */
    private fun removePermission(ss: Boolean, sp: Permission, ap: Permission) =
            ss || (!sp.administrate && (!sp.moderate || ap.administrate) && (ap.moderate || ap.administrate))


    override fun removeMember(conversationId: Long, userId: Long) {
        subjectAndAuthorPair(conversationId, userId)?.let { (author, subject) ->
            if (removePermission(subject.id == author.id, subject.permission, author.permission)) {
                memberRepository.delete(subject)
            }
        } ?: error("Failed to delete member!")
    }
}