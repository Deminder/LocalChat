package de.dem.localchat.rest

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ninjasquad.springmockk.MockkBean
import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.entity.ConversationMessage
import de.dem.localchat.conversation.model.ConversationEvent
import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.conversation.service.EventSubscriptionService
import de.dem.localchat.conversation.service.MemberService
import de.dem.localchat.dtos.requests.ConversationCreateRequest
import de.dem.localchat.dtos.requests.ConversationRenameRequest
import de.dem.localchat.dtos.requests.MessageUpsertRequest
import io.mockk.every
import io.mockk.slot
import io.mockk.verify
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultHandlers.print
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import java.time.Instant

@ActiveProfiles(profiles = ["test"])
@WebMvcTest(
        controllers = [ConversationController::class]
)
internal class ConversationControllerTest(
        @Autowired val webApplicationContext: WebApplicationContext
) {

    @Configuration
    @Import(ConversationController::class)
    class ContextConfiguration {

    }

    @MockkBean
    private lateinit var conversationService: ConversationService

    @MockkBean
    private lateinit var eventSubscriptionService: EventSubscriptionService

    @MockkBean
    private lateinit var memberService: MemberService

    private lateinit var mockMvc: MockMvc

    @BeforeEach
    fun setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build()
    }

    private val json = jacksonObjectMapper()

    @WithMockUser(username = "user1", password = "pwd", authorities = ["USER"])
    @Test
    fun allConversationsOfUser() {

        every { conversationService.listConversations() } returns
                listOf(Conversation(
                        name = "conv1",
                        creator = "user1",
                        createDate = Instant.now()
                ), Conversation(
                        name = "conv2",
                        creator = "user2",
                        createDate = Instant.now()
                ))

        mockMvc.perform(get("/api/conversations"))
                .andDo(print())
                .andExpect(status().isOk)
                .andExpect(jsonPath("\$[0].name").value("conv1"))
                .andExpect(jsonPath("\$[1].name").value("conv2"))
    }

    @WithMockUser(username = "user1", password = "pwd", authorities = ["USER"])
    @Test
    fun `Notify members on conv create`() {
        val cid = 8349L
        val cname = "newConv"
        every { conversationService.createConversation(any(), any()) } returns
                Conversation(
                        id = cid,
                        name = cname,
                        creator = "user1",
                        createDate = Instant.now(),
                )

        every { eventSubscriptionService.notifyMembers(any(), any(), any()) } answers {}

        mockMvc.perform(
                post("/api/conversations")
                        .content(json.writeValueAsString(
                                ConversationCreateRequest(cname, setOf("user2", "user3"))))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk)
                .andExpect(jsonPath("\$.name").value(cname))

        val eventSlot = slot<ConversationEvent>()
        verify { eventSubscriptionService.notifyMembers(capture(eventSlot), cid, *anyVararg()) }
        assertThat(eventSlot.captured.subject, equalTo("upsert-conv"))
    }

    @WithMockUser(username = "user1", password = "pwd", authorities = ["USER"])
    @Test
    fun `Notify members on conv rename`() {
        val cid = 8349L
        val newName = "newName"
        every { conversationService.changeConversationName(cid, newName) } returns
                Conversation(
                        id = cid,
                        name = newName,
                        creator = "user1",
                        createDate = Instant.now(),
                )

        every { eventSubscriptionService.notifyMembers(any(), any(), any()) } answers {}

        mockMvc.perform(
                post("/api/conversations/rename")
                        .content(json.writeValueAsString(
                                ConversationRenameRequest(cid, newName)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk)
                .andExpect(jsonPath("\$.name").value(newName))

        val eventSlot = slot<ConversationEvent>()
        verify { eventSubscriptionService.notifyMembers(capture(eventSlot), cid, *anyVararg()) }
        assertThat(eventSlot.captured.subject, equalTo("upsert-conv"))
    }

    @WithMockUser(username = "user1", password = "pwd", authorities = ["USER"])
    @Test
    fun `Notify members on message upsert`() {
        val cid = 8349L
        val mid = 834L
        val text = "textText"
        every { conversationService.upsertMessage(cid, any(), text) } returns
                ConversationMessage(
                        id = mid,
                        conversationId = cid,
                        text = text,
                        authorId = 1,
                )

        every { eventSubscriptionService.notifyMembers(any(), any(), any()) } answers {}

        mockMvc.perform(
                put("/api/conversations/${cid}/messages")
                        .content(json.writeValueAsString(
                                MessageUpsertRequest(cid, text)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk)
                .andExpect(jsonPath("\$.id").value(mid))
                .andExpect(jsonPath("\$.text").value(text))

        val eventSlot = slot<ConversationEvent>()
        verify { eventSubscriptionService.notifyMembers(capture(eventSlot), cid, *anyVararg()) }
        assertThat(eventSlot.captured.subject, equalTo("upsert-message"))
    }

}