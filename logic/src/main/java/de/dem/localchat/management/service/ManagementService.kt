package de.dem.localchat.management.service

import de.dem.localchat.security.entity.User

interface ManagementService {
    fun allUsers(): List<User>
    fun disableUser(username: String)
    fun enableUser(username: String)
}