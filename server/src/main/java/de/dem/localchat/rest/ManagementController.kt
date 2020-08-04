package de.dem.localchat.rest

import de.dem.localchat.management.service.ManagementService
import de.dem.localchat.security.entity.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/manage")
class ManagementController(private val managementService: ManagementService) {

    @GetMapping("/")
    fun getAllUsers(): List<User> {
        return managementService.allUsers()
    }
}