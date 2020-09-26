package de.dem.localchat.rest

import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.conversation.service.MemberService
import de.dem.localchat.dtos.*
import de.dem.localchat.dtos.requests.*
import org.springframework.web.bind.annotation.*
import java.time.Instant
import javax.validation.Valid


@RestController
@RequestMapping("/api/conversations")
class ConversationController(
        private val conversationService: ConversationService,
        private val memberService: MemberService) {

    @GetMapping
    fun allConversationsOfUser(): List<ConversationNameDto> {
        return conversationService.listConversations()
                .map { it.toConversationNameDto() }
    }

    @PostMapping
    fun createConversation(@RequestBody @Valid createRequest: ConversationCreateRequest): ConversationNameDto {
        return conversationService.createConversation(
                createRequest.name, createRequest.memberNames).toConversationNameDto()
    }

    @PostMapping("/rename")
    fun renameConversation(@RequestBody @Valid req: ConversationRenameRequest): ConversationNameDto {
        return conversationService.changeConversationName(req.conversationId, req.conversationName).toConversationNameDto()
    }


    @PutMapping("/{cid}/messages")
    fun upsertMessage(@PathVariable("cid") cid: Long,
                      @RequestBody r: MessageUpsertRequest): ConversationMessageDto {
        return conversationService.upsertMessage(cid, r.messageId, r.text).toConversationMessageDto()
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
        return conversationService.deleteMessage(cid, messageId)
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
                }
            } ?: error("Permission not specified. Color change not yet implemented!")


    @DeleteMapping("/{cid}/members/{uid}")
    fun deleteMember(
            @PathVariable("cid") cid: Long,
            @PathVariable("uid") uid: Long) {
        return memberService.removeMember(cid, uid)
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

}
