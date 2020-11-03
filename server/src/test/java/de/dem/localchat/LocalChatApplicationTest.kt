package de.dem.localchat

import de.dem.localchat.conversation.dataaccess.MemberRepository
import de.dem.localchat.conversation.model.ConversationEvent
import de.dem.localchat.dtos.ConversationNameDto
import de.dem.localchat.dtos.requests.ConversationCreateRequest
import de.dem.localchat.rest.ConversationController
import de.dem.localchat.rest.ConversationEventsController
import de.dem.localchat.security.dataacess.UserRepository
import de.dem.localchat.security.entity.User
import de.dem.localchat.security.model.TokenRef
import de.dem.localchat.security.model.TokenRefToken
import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkConstructor
import io.mockk.verify
import io.zonky.test.db.AutoConfigureEmbeddedDatabase
import org.hamcrest.CoreMatchers.*
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import javax.servlet.http.HttpSession

@SpringBootTest
@AutoConfigureEmbeddedDatabase
internal class LocalChatApplicationTest {

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var memberRepository: MemberRepository

    @Autowired
    lateinit var conversationController: ConversationController

    @Autowired
    lateinit var conversationEventsController: ConversationEventsController

    private val username = "testUser1"
    private val otherUsername = "testUser2"
    private var users: List<User> = emptyList();

    @BeforeEach
    fun setup() {
        users = listOf(
                User(username = otherUsername, password = "encodedString", enabled = true),
                User(username = username, password = "encodedString", enabled = true)
        ).map { userRepository.save(it) }
    }

    @AfterEach
    fun cleanup() {
        userRepository.deleteAll(users)
    }

    private fun authAs(username: String?) {
        SecurityContextHolder.getContext().authentication = username?.let {
            TokenRefToken(
                    token = TokenRef(token = "ababababa"),
                    userName = it,
                    auths = listOf("USER").map { GrantedAuthority { "ROLE_${it}" } }).apply {
                isAuthenticated = true
            }
        }

    }

    @Test
    fun adminInitialized() {
        val admin = userRepository.findByUsername("admin")
        assertThat(admin?.authorities, hasItem("ADMIN"))
    }

    @Test
    fun addConversationUseCase() {

        mockkConstructor(SseEmitter::class)
        every { anyConstructed<SseEmitter>().send(any()) } answers {}

        val session = mockk<HttpSession> {
            every { id } returns "abcdef"
        }

        authAs(otherUsername)
        val remoteEmitter = conversationEventsController.handleSse(session)
        // expect retry message
        verify(timeout = 100) { remoteEmitter.send(any()) }
        val sendMessages = mutableListOf<Any>()
        every { remoteEmitter.send(ofType(ConversationEvent::class)) } answers {
            sendMessages.add(firstArg())
        }

        authAs(username)
        val localEmitter = conversationEventsController.handleSse(session)
        // expect retry message
        verify(timeout = 100) { localEmitter.send(any()) }

        authAs(username)
        val newConv = conversationController.createConversation(
                ConversationCreateRequest(name = "conv1", setOf(otherUsername)))

        assertThat(memberRepository.findAllByConversationId(newConv.id)
                .mapNotNull { userRepository.findByIdOrNull(it.userId)?.username }, hasItems(username, otherUsername))


        assertThat(sendMessages.size, equalTo(1))
        val event = sendMessages[0] as ConversationEvent
        assertThat(event.subject, equalTo("upsert-conv"))
        val msg = event.message as ConversationNameDto
        assertThat(msg, equalTo(newConv))

    }
}