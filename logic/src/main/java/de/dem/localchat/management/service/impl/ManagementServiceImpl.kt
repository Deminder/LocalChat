package de.dem.localchat.management.service.impl

import de.dem.localchat.management.service.ManagementService
import de.dem.localchat.security.dataacess.UserRepository
import de.dem.localchat.security.entity.User
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ManagementServiceImpl(
        private val userRepository: UserRepository
) : ManagementService {
    override fun allUsers(): List<User> {
        return userRepository
                .findAll()
                .filterNotNull()
    }

    override fun disableUser(username: String) {
        if (isAdmin()) {
            userRepository.deactivateUser(username)
        }

    }

    override fun enableUser(username: String) {
        if (isAdmin()) {
            userRepository.enableUser(username)
        }
    }

    private fun isAdmin(): Boolean {
        return SecurityContextHolder.getContext().authentication?.let {
            it.authorities.find { a -> a.authority == "ADMIN" }
        } != null
    }

}