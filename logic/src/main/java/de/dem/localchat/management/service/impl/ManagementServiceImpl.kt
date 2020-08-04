package de.dem.localchat.management.service.impl

import de.dem.localchat.management.service.ManagementService
import de.dem.localchat.security.dataacess.UserRepository
import de.dem.localchat.security.entity.User
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