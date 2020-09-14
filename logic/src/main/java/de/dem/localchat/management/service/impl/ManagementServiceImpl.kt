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

    @Transactional
    override fun setUserEnabled(id: Long, enabled: Boolean) {
        if (isAdmin()) {
            userRepository.findById(id).ifPresent {
                it.enabled = enabled
            }
        }
    }

    override fun deleteUser(id: Long) {
        if (isAdmin()) {
            userRepository.deleteById(id)
        }
    }

    private fun isAdmin() = SecurityContextHolder.getContext().authentication?.let {
        it.authorities.find { a -> a.authority == "ADMIN" }
    } != null

}