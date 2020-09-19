package de.dem.localchat.rest

import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.conversation.service.MemberService
import de.dem.localchat.dtos.*
import de.dem.localchat.dtos.requests.ConversationCreateRequest
import de.dem.localchat.dtos.requests.MemberUpdateRequest
import de.dem.localchat.dtos.requests.MessageSearchRequest
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import javax.validation.Valid


@RestController
@RequestMapping("/api/conversations")
class ConversationController(
        private val conversationService: ConversationService,
        private val memberService: MemberService) {

    @GetMapping
    fun allConversationsOfUser(): List<ConversationNameDto> {
        return conversationService.conversationsByUserName(username())
                .map { it.toConversationNameDto() }
    }

    @PostMapping
    fun createConversation(@RequestBody @Valid createRequest: ConversationCreateRequest): ConversationNameDto {
        return conversationService.createConversation(
            username(), createRequest.conversationName, createRequest.memberNames).toConversationNameDto()
    }

    @GetMapping("/{cid}/messages")
    fun searchMessages(@PathVariable("cid") cid: Long,
                       @RequestBody r: MessageSearchRequest): ConversationMessagePageDto {
        return conversationService.conversationMessagePage(cid, r.page, r.pageSize,
            r.olderThan, r.newerThan, r.search, r.regex).toConversationMessagePageDto()
    }

    @GetMapping("/{cid}/members")
    fun listMembers(@PathVariable("cid") cid: Long): List<MemberDto> {
        return conversationService.membersOfConversation(cid).map {
            it.toMemberDto(memberService.memberName(cid, it.userId))
        }
    }

    @PostMapping("/{cid}/members/{uid}")
    fun upsertMember(
            @PathVariable("cid") cid: Long,
            @PathVariable("uid") uid: Long,
            @Valid @RequestBody updateRequest: MemberUpdateRequest): MemberDto =
            updateRequest.permission?.let {
                memberService.upsertMember(cid, uid, it.toPermission()).let { member ->
                    member.toMemberDto(memberService.memberName(cid, member.userId))
                }
            } ?: error("Permission not specified. Color change not yet implemented!")


    @DeleteMapping("/{cid}/members/{uid}")
    fun deleteMember(
            @PathVariable("cid") cid: Long,
            @PathVariable("uid") uid: Long) {
        return memberService.removeMember(cid, uid)
    }

    @GetMapping("/{cid}/members/{uid}/allowed-modification")
    fun deleteMemberPermission(
            @PathVariable("cid") cid: Long,
            @PathVariable("uid") uid: Long): MemberModifyPermissionDto {
        return MemberModifyPermissionDto(
                memberService.allowedPermissionChange(cid, uid).toPermissionDto(),
                memberService.allowedRemoval(cid, uid)
        )
    }

    private fun username() = SecurityContextHolder.getContext().authentication?.name ?: error("Not logged in!")

}
