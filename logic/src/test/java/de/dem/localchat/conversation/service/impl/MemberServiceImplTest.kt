package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.dataaccess.ConversationMessageRepository
import de.dem.localchat.conversation.dataaccess.ConversationRepository
import de.dem.localchat.conversation.dataaccess.MemberRepository
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.security.dataacess.UserRepository
import io.mockk.*
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.api.fail
import org.springframework.security.core.context.SecurityContextHolder

@ExtendWith(MockKExtension::class)
internal class MemberServiceImplTest {

    @MockK
    lateinit var memberRepository: MemberRepository

    @MockK
    lateinit var conversationMessageRepository: ConversationMessageRepository

    @MockK
    lateinit var userRepository: UserRepository

    @MockK
    lateinit var conversationRepository: ConversationRepository


    private lateinit var unit: MemberServiceImpl

    private val user1 = "user1"

    @BeforeEach
    fun setup() {
        mockkStatic(SecurityContextHolder::class)
        every { SecurityContextHolder.getContext() } returns mockk {
            every { authentication } returns mockk {
                every { name } returns user1
            }
        }

        unit = MemberServiceImpl(memberRepository, conversationMessageRepository, userRepository, conversationRepository)
    }

    @Test
    fun `Check member permission`() {
        val cid = 222L

        val user2 = "user2"
        val user3 = "user3"
        val user4 = "user4"

        every { memberRepository.findByIdAndUsername(any(), user1) } returns null
        every { memberRepository.findByIdAndUsername(any(), user2) } returns mockk {
            every { permission } returns Permission(administrate = false, moderate = false)
        }
        every { memberRepository.findByIdAndUsername(any(), user3) } returns mockk {
            every { permission } returns Permission(administrate = true, moderate = false)
        }
        every { memberRepository.findByIdAndUsername(any(), user4) } returns mockk {
            every { permission } returns Permission(administrate = false, moderate = true)
        }

        assert(!unit.isMember(cid, user1, "ADMIN", "MOD")) {
            "User1 has neither ADMIN nor MOD permission"
        }
        assert(!unit.isMember(cid, user2, "ADMIN", "MOD")) {
            "User2 has neither ADMIN nor MOD permission"
        }
        assert(unit.isMember(cid, user3, "ADMIN", "MOD")) {
            "User3 has ADMIN permission"
        }
        assert(unit.isMember(cid, user4, "ADMIN", "MOD")) {
            "User4 has MOD permission"
        }
    }

    @Test
    fun `Execute allowed permission change`() {

        val cid = 222L
        val authorMember = mockk<Member> {
            every { id } returns 1L
            every { permission } returns Permission(administrate = true, moderate = true)
        }
        val subject = "user2"
        val subjectId = 2L
        val prevPermission = Permission(
                read = true, write = true, voice = true
        )
        val changedSubject = mockk<Member>()
        val subjectMember = mockk<Member> {
            every { id } returns subjectId
            every { permission } returns prevPermission
            every { copy(permission = any()) } returns changedSubject
        }

        every { memberRepository.findByIdAndUsername(any(), user1) } returns authorMember
        every { memberRepository.findByConvIdAndUserId(cid, subjectId) } returns subjectMember

        every { memberRepository.findByIdAndUsername(any(), subject) } returns mockk {
            every { permission } returns Permission(administrate = false, moderate = false)
        }

        every { memberRepository.findAllByConversationId(cid) } returns listOf(authorMember, subjectMember)

        every { memberRepository.save(changedSubject) } returns changedSubject


        // remove write permission
        val reqPermission = Permission(read = true, write = false, voice = true)
        val resMember = unit.upsertMember(cid, subjectId, reqPermission)

        assertThat(resMember, equalTo(changedSubject))

        verify { memberRepository.save(changedSubject) }

        val wp = slot<Permission>()
        verify { subjectMember.copy(permission = capture(wp)) }
        assertThat(wp.captured, equalTo(reqPermission))
    }

    @Test
    fun `Allowed self removal`() {
        val cid = 222L
        val authorMember = mockk<Member> {
            every { id } returns 1L
            every { permission } returns Permission()
        }
        every { memberRepository.findByIdAndUsername(any(), user1) } returns authorMember
        every { memberRepository.findByConvIdAndUserId(cid, 1L) } returns authorMember

        assert(unit.allowedRemoval(cid, 1L)) {
            "User1 is should always be able to remove themself"
        }
    }

    @Test
    fun `Disallowed other deletion as non-mod`() {
        val cid = 222L
        every { memberRepository.findByIdAndUsername(any(), user1) } returns mockk {
            every { id } returns 1L
            every { permission } returns Permission(read = true, write = true, voice = true)
        }
        every { memberRepository.findByConvIdAndUserId(cid, 2L) } returns mockk {
            every { id } returns 2L
            every { permission } returns Permission(read = true, write = true, voice = true)
        }

        assert(!unit.allowedRemoval(cid, 2L)) {
            "User1 is not MOD and should not be able to remove other users"
        }
    }

    @Test
    fun `Disallowed other deletion as mod`() {
        val cid = 222L
        every { memberRepository.findByIdAndUsername(any(), user1) } returns mockk {
            every { id } returns 1L
            every { permission } returns Permission(read = true, write = true, voice = true, moderate = true)
        }
        every { memberRepository.findByConvIdAndUserId(cid, 2L) } returns mockk {
            every { id } returns 2L
            every { permission } returns Permission(read = true, write = true, voice = true, administrate = true)
        }

        assert(!unit.allowedRemoval(cid, 2L)) {
            "User1 is MOD but can not remove ADMIN"
        }
    }

    @Test
    fun `General member change permissions as admin`() {
        val cid = 222L

        val authorMember = mockk<Member> {
            every { id } returns 1L
            every { permission } returns Permission(administrate = true)
        }

        every { memberRepository.findByIdAndUsername(any(), user1) } returns authorMember
        every { memberRepository.findByConvIdAndUserId(cid, 1L) } returns authorMember

        every { memberRepository.findByConvIdAndUserId(cid, 2L) } returns mockk {
            every { id } returns 2L
            every { permission } returns Permission(read = true, write = true, voice = false, moderate = true)
        }
        every { memberRepository.findByConvIdAndUserId(cid, 3L) } returns mockk {
            every { id } returns 3L
            every { permission } returns Permission(administrate = true)
        }

        assertThat(unit.allowedPermissionChange(cid, 1L), equalTo(
                Permission(
                        read = true, write = true, voice = true, administrate = true, moderate = true
                )
        ))

        assertThat(unit.allowedPermissionChange(cid, 2L), equalTo(
                Permission(
                        read = true, write = true, voice = true, administrate = true, moderate = true
                )
        ))
        // can not remove admin permission
        assertThat(unit.allowedPermissionChange(cid, 3L), equalTo(
                Permission(
                        read = true, write = true, voice = true, administrate = false, moderate = true
                )
        ))
    }

    @Test
    fun `General member change permissions as mod`() {
        val cid = 222L

        val authorMember = mockk<Member> {
            every { id } returns 1L
            every { permission } returns Permission(moderate = true)
        }

        every { memberRepository.findByIdAndUsername(any(), user1) } returns authorMember
        every { memberRepository.findByConvIdAndUserId(cid, 1L) } returns authorMember

        every { memberRepository.findByConvIdAndUserId(cid, 2L) } returns mockk {
            every { id } returns 2L
            every { permission } returns Permission(read = true, write = true, voice = false)
        }
        every { memberRepository.findByConvIdAndUserId(cid, 3L) } returns mockk {
            every { id } returns 3L
            every { permission } returns Permission(moderate = true)
        }

        assertThat(unit.allowedPermissionChange(cid, 1L), equalTo(
                Permission(
                        read = true, write = true, voice = true, administrate = false, moderate = true
                )
        ))

        assertThat(unit.allowedPermissionChange(cid, 2L), equalTo(
                Permission(
                        read = true, write = true, voice = true, administrate = false, moderate = true
                )
        ))

        // can not remove mod permission
        assertThat(unit.allowedPermissionChange(cid, 3L), equalTo(
                Permission(
                        read = true, write = true, voice = true, administrate = false, moderate = false
                )
        ))

    }

    @Test
    fun `General member change permissions as non-mod`() {
        val cid = 222L

        val authorMember = mockk<Member> {
            every { id } returns 1L
            every { permission } returns Permission(read = true, write = true, voice = true)
        }

        every { memberRepository.findByIdAndUsername(any(), user1) } returns authorMember
        every { memberRepository.findByConvIdAndUserId(cid, 1L) } returns authorMember

        every { memberRepository.findByConvIdAndUserId(cid, 2L) } returns mockk {
            every { id } returns 2L
            every { permission } returns Permission(read = true, write = true, voice = false)
        }

        assertThat(unit.allowedPermissionChange(cid, 1L), equalTo(
                Permission(
                        read = false, write = false, voice = false, administrate = false, moderate = false
                )
        ))

        assertThat(unit.allowedPermissionChange(cid, 2L), equalTo(
                Permission(
                        read = false, write = false, voice = false, administrate = false, moderate = false
                )
        ))

    }

    @Test
    fun `Execute failing admin permission change`() {
        // can not remove admin if last admin
        // except it is the last admin in conversation

        val cid = 222L
        val authorMember = mockk<Member> {
            every { id } returns 1L
            every { permission } returns Permission(
                    administrate = true, moderate = true, voice = true, write = true, read = true)
        }

        val changedSubject = mockk<Member>()

        every { memberRepository.findByIdAndUsername(any(), user1) } returns authorMember
        every { memberRepository.findByConvIdAndUserId(cid, 1L) } returns authorMember
        every { authorMember.copy(permission = any()) } returns authorMember


        every { memberRepository.findAllByConversationId(cid) } returns listOf(authorMember, mockk {
            // other member is not an admin
            every { permission } returns Permission(moderate = true, voice = true, write = true, read = true)
        })
        every { memberRepository.save(changedSubject) } returns changedSubject

        try {
            // remove admin permission
            unit.upsertMember(cid, 1L, Permission(read = true, write = true, voice = true, moderate = true))
            fail { "Last admin can not be removed when user remains!" }
        } catch (ex: IllegalStateException) {
            assertThat(ex.message, equalTo("Choose next admin before removing the current!"))
        }
    }

    @Test
    fun `Execute correct admin permission change`() {
        // can remove admin if other member is admin

        val cid = 222L
        val authorMember = mockk<Member> {
            every { id } returns 1L
            every { permission } returns Permission(
                    administrate = true, moderate = true, voice = true, write = true, read = true)
        }

        val changedSubject = mockk<Member>()

        every { memberRepository.findByIdAndUsername(any(), user1) } returns authorMember
        every { memberRepository.findByConvIdAndUserId(cid, 1L) } returns authorMember
        every { authorMember.copy(permission = any()) } returns authorMember
        every { memberRepository.save(authorMember) } returns authorMember

        every { memberRepository.findAllByConversationId(cid) } returns listOf(authorMember, mockk {
            // other member is not an admin
            every { permission } returns Permission(administrate = true)
        })
        every { memberRepository.save(changedSubject) } returns changedSubject


        val reqPerm = Permission(read = true, write = true, voice = true, moderate = true)
        assertThat(unit.upsertMember(cid, 1L, reqPerm), equalTo(authorMember))

        val perm = slot<Permission>()
        verify { authorMember.copy(permission = capture(perm)) }
        assertThat(perm.captured, equalTo(reqPerm))
    }

}