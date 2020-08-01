package de.dem.localchat.management.service.impl

import de.dem.localchat.conversation.entity.User
import de.dem.localchat.management.dataaccess.UserRepository
import de.dem.localchat.management.service.ManagementService
import org.springframework.stereotype.Service

@Service
class ManagementServiceImpl(
        private val userRepository: UserRepository
) : ManagementService {
    override fun allUsers(): List<User> {
        return userRepository
                .findAll()
                .filterNotNull()
    }

}