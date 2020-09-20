package de.dem.localchat.rest

import com.ninjasquad.springmockk.MockkBean
import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.service.ConversationService
import de.dem.localchat.conversation.service.MemberService
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers.print
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Instant

@ActiveProfiles(profiles = ["test"])
@WebMvcTest(
        controllers = [ConversationController::class]
)
internal class ConversationControllerTest(
        @Autowired val mockMvc: MockMvc
) {

    @Configuration
    @Import(ConversationController::class)
    class ContextConfiguration {

    }

    @MockkBean
    private lateinit var conversationService: ConversationService

    @MockkBean
    private lateinit var memberService: MemberService


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
}