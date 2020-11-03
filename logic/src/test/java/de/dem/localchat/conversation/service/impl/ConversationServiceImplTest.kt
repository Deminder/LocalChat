package de.dem.localchat.conversation.service.impl

import de.dem.localchat.conversation.dataaccess.ConversationMessageRepository
import de.dem.localchat.conversation.dataaccess.ConversationRepository
import de.dem.localchat.conversation.dataaccess.MemberRepository
import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.entity.Member
import de.dem.localchat.conversation.entity.Permission
import de.dem.localchat.conversation.model.ConversationMessagePage
import de.dem.localchat.security.dataacess.UserRepository
import io.mockk.*
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.CoreMatchers.hasItems
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.security.core.context.SecurityContextHolder
import java.time.Instant

@ExtendWith(MockKExtension::class)
internal class ConversationServiceImplTest {

    @MockK
    lateinit var conversationRepository: ConversationRepository

    @MockK
    lateinit var memberRepository: MemberRepository

    @MockK
    lateinit var userRepository: UserRepository

    @MockK
    lateinit var conversationMessageRepository: ConversationMessageRepository


    private lateinit var unit: ConversationServiceImpl

    private val userName = "user1"

    @BeforeEach
    fun setUp() {
        mockkStatic(SecurityContextHolder::class)
        every { SecurityContextHolder.getContext() } returns mockk {
            every { authentication } returns mockk {
                every { name } returns userName
            }
        }

        val memberName = slot<String>()
        every { userRepository.findByUsername(capture(memberName)) } answers {
            firstArg<String>().let { name ->
                mockk {
                    every { id } returns Integer.parseInt(name.substring(name.length - 1)).toLong()
                }
            }
        }

        unit = ConversationServiceImpl(
                conversationRepository, memberRepository, userRepository, conversationMessageRepository
        )
    }

    @Test
    fun `List conversations by conversation repository`() {
        val conversations = mockk<List<Conversation>>()


        every { conversationRepository.findAllByUser(1L) } returns conversations

        assertThat(unit.listConversations(), equalTo(conversations))
    }

    @Test
    fun `List members by member repository`() {
        val members = mockk<List<Member>>()
        val cid = 111L
        every { memberRepository.findAllByConversationId(cid) } returns members

        assertThat(unit.membersOfConversation(cid), equalTo(members))
    }

    @Test
    fun `Create new message`() {
        val msg = slot<ConversationMessage>()
        val msg2 = mockk<ConversationMessage>()
        val cid = 111L
        val text = "textText"


        every { conversationMessageRepository.save(any()) } returns msg2

        assertThat(unit.upsertMessage(cid, null, text), equalTo(msg2))

        verify { conversationMessageRepository.save(capture(msg)) }
        assertThat(msg.captured.authorId, equalTo(1L))
        assertThat(msg.captured.conversationId, equalTo(cid))
        assertThat(msg.captured.text, equalTo(text))
    }

    @Test
    fun `Edit existing message`() {
        val msg2 = mockk<ConversationMessage>()
        val msg = mockk<ConversationMessage> {
            every { copy(text = any()) } returns msg2
        }
        val cid = 111L
        val mid = 222L
        val text = "textText"
        every { conversationMessageRepository.findByIdAndAuthorId(any(), any()) } returns msg

        every { conversationMessageRepository.save(any()) } returns msg2

        assertThat(unit.upsertMessage(cid, mid, text), equalTo(msg2))

        verify { conversationMessageRepository.save(msg2) }
        verify { msg.copy(text = text) }
        verify { conversationMessageRepository.findByIdAndAuthorId(mid, 1L) }
    }

    @Test
    fun `Delete existing message`() {
        val msg = mockk<ConversationMessage>()
        val cid = 111L
        val mid = 222L
        every { conversationMessageRepository.findByIdAndConversationId(any(), any()) } returns msg

        every { conversationMessageRepository.delete(any()) } answers {}

        unit.deleteMessage(cid, mid)

        verify { conversationMessageRepository.findByIdAndConversationId(mid, cid) }
        verify { conversationMessageRepository.delete(msg) }
    }

    @Test
    fun `Search messages by regex`() {
        val messages: List<ConversationMessage> = listOf(mockk {}, mockk {}, mockk {})
        val cid = 111L
        val page = 2
        val pageSize = messages.size
        val olderThan = Instant.now().minusSeconds(100)
        val newerThan = Instant.now()
        val search = "regex.Search"
        val regex = true
        every {
            conversationMessageRepository.findAllMessagesByPattern(
                    any(), any(), any(), any(), any(), any())
        } returns messages

        assertThat(unit.conversationMessagePage(cid, page, pageSize, olderThan, newerThan, search, regex),
                equalTo(ConversationMessagePage(
                        last = false,
                        messages = messages,
                )))

        verify {
            conversationMessageRepository.findAllMessagesByPattern(
                    cid, olderThan, newerThan, search, pageSize, page * pageSize)
        }

    }

    @Test
    fun `Initialize new conversation with correct permissions`() {
        val convName = "convName"
        val memberNames = setOf("user2", "user3")
        val cid = 111L
        val convEntity = slot<Conversation>()

        every { conversationRepository.save(capture(convEntity)) } answers {
            convEntity.captured.copy(
                    id = cid
            )
        }

        every { memberRepository.saveAll(any()) } returns mockk {}

        val conv = unit.createConversation(convName, memberNames)
        assertThat(conv.id, equalTo(cid))
        assertThat(conv.name, equalTo(convName))

        val obsMemberNames = mutableListOf<String>()
        verify(exactly = 3) { userRepository.findByUsername(capture(obsMemberNames)) }
        assertThat(obsMemberNames, hasItems(userName, "user2", "user3"))

        val obsMembers = slot<List<Member>>()
        verify { memberRepository.saveAll(capture(obsMembers)) }
        assertThat(obsMembers.captured.size, equalTo(3))
        assertThat(obsMembers.captured.find { it.userId == 1L }?.permission, equalTo(Permission(
                read = true,
                write = true,
                voice = true,
                moderate = true,
                administrate = true
        )))
        assertThat(obsMembers.captured.find { it.userId != 1L }?.permission, equalTo(Permission(
                read = true,
                write = true,
                voice = true,
                moderate = false,
                administrate = false
        )))
    }
}