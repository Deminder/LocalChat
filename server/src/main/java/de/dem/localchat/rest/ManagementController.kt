package de.dem.localchat.rest

import de.dem.localchat.management.service.ManagementService
import de.dem.localchat.security.entity.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/manage")
class ManagementController(private val managementService: ManagementService) {

    @GetMapping("/users")
    fun getAllUsers(enabled: Boolean?): List<User> {
        return managementService.allUsers()
                .filter { enabled == null || it.enabled == enabled}
    }

    @PostMapping("/user/disable")
    fun disableUser(username: String) {
        managementService.disableUser(username)
    }

    @PostMapping("/user/enable")
    fun enableUser(username: String) {
        managementService.enableUser(username)
    }
}