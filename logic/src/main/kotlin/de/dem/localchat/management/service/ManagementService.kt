package de.dem.localchat.management.service

import de.dem.localchat.security.entity.User

interface ManagementService {
    fun allUsers(): List<User>
    fun setUserEnabled(id: Long, enabled: Boolean)
    fun deleteUser(id: Long)
}