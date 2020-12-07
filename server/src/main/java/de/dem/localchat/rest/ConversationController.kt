package de.dem.localchat.rest

import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.model.ConversationEvent
import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.conversation.service.EventSubscriptionService
import de.dem.localchat.conversation.service.MemberService
import de.dem.localchat.dtos.*
import de.dem.localchat.dtos.requests.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import javax.validation.Valid


@RestController
@RequestMapping("/api/conversations")
class ConversationController(
        @Autowired val conversationService: ConversationService,
        @Autowired val memberService: MemberService,
        @Autowired val eventSubscriptionService: EventSubscriptionService) {

    @GetMapping
    fun allConversationsOfUser(): List<ConversationNameDto> {
        return conversationService.listConversations()
                .map { it.toConversationNameDto(unreadCount(it.id!!)) }
    }

    @PostMapping
    fun createConversation(@RequestBody @Valid req: ConversationCreateRequest): ConversationNameDto {
        return conversationService.createConversation(req.name, req.memberNames)
                .toConversationNameDto(0).also {
                    eventSubscriptionService.notifyMembers(
                            ConversationEvent("upsert-conv", it), it.id, username())
                }
    }

    @PostMapping("/rename")
    fun renameConversation(@RequestBody @Valid req: ConversationRenameRequest): ConversationNameDto {
        return conversationService.changeConversationName(req.conversationId, req.conversationName)
                .toConversationNameDto(unreadCount(req.conversationId)).also {
                    eventSubscriptionService.notifyMembers(
                            ConversationEvent("upsert-conv", it), it.id, username())
                }
    }

    @GetMapping("/{cid}")
    fun getConversation(@PathVariable("cid") conversationId: Long): ConversationNameDto {
        return conversationService.getConversation(conversationId)?.let {
            it.toConversationNameDto(unreadCount(it.id!!))
        } ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found!")
    }


    @PutMapping("/{cid}/messages")
    fun upsertMessage(@PathVariable("cid") cid: Long,
                      @RequestBody r: MessageUpsertRequest): ConversationMessageDto {
        return conversationService.upsertMessage(cid, r.messageId, r.text)
                .toConversationMessageDto().also {
                    eventSubscriptionService.notifyMembers(
                            ConversationEvent("upsert-message",
                                    mapOf("conversationId" to cid, "message" to it)), cid, username())
                }
    }

    @PostMapping("/{cid}/messages")
    fun searchMessages(@PathVariable("cid") cid: Long,
                       @RequestBody r: MessageSearchRequest): ConversationMessagePageDto {
        return conversationService.conversationMessagePage(cid, r.page, r.pageSize,
                Instant.ofEpochMilli(r.olderThan), Instant.ofEpochMilli(r.newerThan),
                r.search, r.regex).toConversationMessagePageDto(cid, r)
    }

    @GetMapping("/{cid}/mark-read")
    fun markRead(@PathVariable("cid") cid: Long): MarkReadResponse {
        return MarkReadResponse(toMemberDto(conversationService.memberReadsConversation(cid)), getConversation(cid))
    }

    @DeleteMapping("/{cid}/messages/{mid}")
    fun deleteMessage(@PathVariable("cid") cid: Long, @PathVariable("mid") messageId: Long) {
        conversationService.deleteMessage(cid, messageId).also {
            eventSubscriptionService.notifyMembers(
                    ConversationEvent("delete-message",
                            mapOf("conversationId" to cid, "messageId" to messageId)), cid, username())
        }
    }

    @GetMapping("/{cid}/members")
    fun listMembers(@PathVariable("cid") cid: Long): List<MemberDto> {
        return conversationService.membersOfConversation(cid).map { toMemberDto(it) }
    }

    @PostMapping("/{cid}/members/{uid}")
    fun upsertMember(
            @PathVariable("cid") cid: Long,
            @PathVariable("uid") uid: Long,
            @Valid @RequestBody updateRequest: MemberUpdateRequest): MemberDto =
            updateRequest.permission?.let {
                toMemberDto(memberService.upsertMember(cid, uid,
                        it.toPermission(),
                        updateRequest.color?.let {c ->
                            c.replace("#", "").toIntOrNull(16)
                        }
                ).also { member ->
                    eventSubscriptionService.notifyMembers(
                            ConversationEvent("upsert-member", member), cid, username())
                })
            } ?: error("Permission not specified!")


    @DeleteMapping("/{cid}/members/{uid}")
    fun deleteMember(
            @PathVariable("cid") cid: Long,
            @PathVariable("uid") uid: Long) {
        return memberService.removeMember(cid, uid).also {
            eventSubscriptionService.notifyMembers(
                    ConversationEvent("delete-member",
                            mapOf("conversationId" to cid, "userId" to uid)), cid, username())
        }
    }

    @GetMapping("/{cid}/members/{uid}/allowed-modification")
    fun allowedModification(
            @PathVariable("cid") cid: Long,
            @PathVariable("uid") uid: Long): MemberModifyPermissionDto {
        return MemberModifyPermissionDto(
                memberService.allowedPermissionChange(cid, uid).toPermissionDto(),
                memberService.allowedRemoval(cid, uid)
        )
    }

    private fun toMemberDto(member: Member): MemberDto =
            member.toMemberDto(
                    memberService.memberName(member.conversationId, member.userId),
                    allowedModification(member.conversationId, member.userId))


    private fun unreadCount(conversationId: Long): Int = conversationService.countUnreadMessages(conversationId)

    private fun username() = SecurityContextHolder.getContext().authentication?.name
            ?: throw ResponseStatusException(HttpStatus.FORBIDDEN, "Not logged in user!")
}
