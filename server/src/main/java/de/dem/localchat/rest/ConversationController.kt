package de.dem.localchat.rest

import de.dem.localchat.conversation.model.ConversationEvent
import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.conversation.service.EventSubscriptionService
import de.dem.localchat.conversation.service.MemberService
import de.dem.localchat.dtos.*
import de.dem.localchat.dtos.requests.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
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
                .map { it.toConversationNameDto() }
    }

    @PostMapping
    fun createConversation(@RequestBody @Valid createRequest: ConversationCreateRequest): ConversationNameDto {
        return conversationService.createConversation(createRequest.name, createRequest.memberNames)
                .toConversationNameDto().also {
                    eventSubscriptionService.notifyMembers(
                            ConversationEvent("upsert-conv", it), it.id, username())
                }
    }

    @PostMapping("/rename")
    fun renameConversation(@RequestBody @Valid req: ConversationRenameRequest): ConversationNameDto {
        return conversationService.changeConversationName(req.conversationId, req.conversationName)
                .toConversationNameDto().also {
                    eventSubscriptionService.notifyMembers(
                            ConversationEvent("upsert-conv", it), it.id, username())
                }
    }


    @PutMapping("/{cid}/messages")
    fun upsertMessage(@PathVariable("cid") cid: Long,
                      @RequestBody r: MessageUpsertRequest): ConversationMessageDto {
        return conversationService.upsertMessage(cid, r.messageId, r.text)
                .toConversationMessageDto().also {
                    eventSubscriptionService.notifyMembers(
                            ConversationEvent("upsert-message", it), cid, username())
                }
    }

    @PostMapping("/{cid}/messages")
    fun searchMessages(@PathVariable("cid") cid: Long,
                       @RequestBody r: MessageSearchRequest): ConversationMessagePageDto {
        return conversationService.conversationMessagePage(cid, r.page, r.pageSize,
                Instant.ofEpochMilli(r.olderThan), Instant.ofEpochMilli(r.newerThan),
                r.search, r.regex).toConversationMessagePageDto()
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
        return conversationService.membersOfConversation(cid).map {
            it.toMemberDto(memberService.memberName(cid, it.userId), allowedModification(cid, it.userId))
        }
    }

    @PostMapping("/{cid}/members/{uid}")
    fun upsertMember(
            @PathVariable("cid") cid: Long,
            @PathVariable("uid") uid: Long,
            @Valid @RequestBody updateRequest: MemberUpdateRequest): MemberDto =
            updateRequest.permission?.let {
                memberService.upsertMember(cid, uid, it.toPermission()).let { member ->
                    member.toMemberDto(memberService.memberName(cid, member.userId), allowedModification(cid, uid))
                }.also { member ->
                    eventSubscriptionService.notifyMembers(
                            ConversationEvent("upsert-member", member), cid, username())
                }
            } ?: error("Permission not specified. Color change not yet implemented!")


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

    private fun username() = SecurityContextHolder.getContext().authentication?.name
            ?: error("Not logged in!")
}
