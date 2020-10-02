package de.dem.localchat

import de.dem.localchat.security.dataacess.UserRepository
import io.zonky.test.db.AutoConfigureEmbeddedDatabase
import org.hamcrest.CoreMatchers
import org.hamcrest.CoreMatchers.hasItem
import org.hamcrest.CoreMatchers.hasItems
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
@AutoConfigureEmbeddedDatabase
internal class LocalChatApplicationTest {

    @Autowired
    lateinit var userRepository: UserRepository

    @Test
    fun contextLoads() {

    }

    @Test
    fun adminInitialized() {
        val admin = userRepository.findByUsername("admin")
        assertThat(admin?.authorities, hasItem("ADMIN"))
    }



}