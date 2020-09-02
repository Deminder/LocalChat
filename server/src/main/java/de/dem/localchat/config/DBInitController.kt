package de.dem.localchat.config

import de.dem.localchat.security.dataacess.UserRepository
import de.dem.localchat.security.entity.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

@Component
class DBInitController(
        @Autowired val userRepository: UserRepository,
        @Value("\${manage.admin.password}") val adminPassword: String
) {


    @EventListener(ContextRefreshedEvent::class)
    fun onStartup() {
        if (adminNotInitialized()) {

            userRepository.save(User("admin", adminPassword, authorities = setOf("ADMIN", "USER", "MANAGER")))
        }
    }

    private fun adminNotInitialized() : Boolean {
        return userRepository.findByUsername("admin") == null
    }
}