package de.dem.localchat.management.service

import de.dem.localchat.conversation.entity.User

interface ManagementService {
    fun allUsers(): List<User>
}