package de.dem.localchat.rest

import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.conversation.service.MemberService
import de.dem.localchat.dtos.*
import de.dem.localchat.dtos.requests.ConversationCreateRequest
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
                username(), createRequest.conversationName, createRequest.memberNames).let {
            it.toConversationNameDto()
        }
    }


    @GetMapping("/{cid}/members")
    fun listMembers(@PathVariable("cid") cid: Long): List<MemberDto> {
        return conversationService.membersOfConversation(cid).map {
            it.toMemberDto(memberService.memberName(cid, it.userId))
        }
    }

    @PostMapping("/{cid}/members/{uid}")
    fun updateMember(
            @PathVariable("cid") cid: Long,
            @PathVariable("uid") uid: Long,
            @Valid permission: PermissionDto): MemberDto {
        return memberService.permissionChange(cid, uid, permission.toPermission()).let {
            it.toMemberDto(memberService.memberName(cid, it.userId))
        }
    }

    @DeleteMapping("/{cid}/members/{uid}")
    fun deleteMember(
            @PathVariable("cid") cid: Long,
            @PathVariable("uid") uid: Long) {
        return memberService.removeMember(cid, uid)
    }

    private fun username() = SecurityContextHolder.getContext().authentication?.name ?: error("Not logged in!")

}
