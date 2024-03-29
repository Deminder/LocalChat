package de.dem.localchat.config

import de.dem.localchat.security.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

@Component
class DBInitController(
    @Autowired val userRegistrationService: UserService
) {


    @EventListener(ContextRefreshedEvent::class)
    fun onStartup() {
        userRegistrationService.initAdmin()
    }


}