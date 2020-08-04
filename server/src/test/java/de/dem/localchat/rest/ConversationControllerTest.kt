package de.dem.localchat.rest

import com.ninjasquad.springmockk.MockkBean
import de.dem.localchat.LocalChatApplication
import de.dem.localchat.config.SecurityConfig
import de.dem.localchat.conversation.entity.Conversation
import de.dem.localchat.conversation.service.ConversationService
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers.print
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDateTime

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


    @WithMockUser(username = "user1", password = "pwd", authorities = ["USER"])
    @Test
    fun allConversationsOfUser() {

        every { conversationService.allConversationsByUserName("user1") } returns
                listOf(Conversation(
                        name = "conv1",
                        messages = emptyList(),
                        members = emptySet(),
                        createDate = LocalDateTime.now()
                ), Conversation(
                        name = "conv2",
                        messages = emptyList(),
                        members = emptySet(),
                        createDate = LocalDateTime.now()
                ))

        mockMvc.perform(get("/api/conversation"))
                .andDo(print())
                .andExpect(status().isOk)
                .andExpect(jsonPath("\$[0].name").value("conv1"))
                .andExpect(jsonPath("\$[1].name").value("conv2"))
    }
}