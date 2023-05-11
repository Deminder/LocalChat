package de.dem.localchat.rest

import de.dem.localchat.management.service.ManagementService
import de.dem.localchat.security.entity.User
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/manage")
class ManagementController(private val managementService: ManagementService) {

    @GetMapping("/users")
    fun getAllUsers(enabled: Boolean?): List<User> {
        return managementService.allUsers()
            .filter { enabled == null || it.enabled == enabled }
    }

    @PostMapping("/users/{id}/disable")
    fun disableUser(@PathVariable id: Long) {
        managementService.setUserEnabled(id, false)
    }

    @PostMapping("/users/{id}/enable")
    fun enableUser(@PathVariable id: Long) {
        managementService.setUserEnabled(id, true)
    }

    @GetMapping("/users/{id}")
    fun getUser(@PathVariable id: Long): User {
        return managementService.allUsers().find { it.id == id } ?: error("No such user!")
    }

    @DeleteMapping("/users/{id}")
    fun deleteUser(@PathVariable id: Long) {
        managementService.deleteUser(id)
    }
}