package de.dem.localchat.security.service.impl

import de.dem.localchat.security.dataacess.UserRepository
import de.dem.localchat.security.entity.User
import de.dem.localchat.security.service.RegistrationService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.factory.PasswordEncoderFactories
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
class RegistrationServiceImpl(
        @Autowired val userRepository: UserRepository,
        @Value("\${manage.admin.password:admin}") val adminPassword: String
) : RegistrationService {

    @Transactional
    override fun registerUser(name: String, password: String) {
        if (isRegistered(name)) {
            throw IllegalArgumentException("User '${name}' already exists!")
        }
        userRepository.save(
                User(name, enc(password), authorities = setOf("USER"))
        )
    }

    override fun changePassword(password: String) {
        val name = SecurityContextHolder.getContext().authentication?.name ?: error("Not authenticated!")
        userRepository.findByUsername(name)?.let {
            userRepository.save(it.copy(password = enc(password)))
        } ?: error("User '${name}' not found!")
    }

    override fun deleteUser(name: String) {
        userRepository.findByUsername(name)?.let {
            userRepository.delete(it)
        }

    }

    @Transactional
    override fun initAdmin() {
        if( ! isRegistered("admin") ) {
            userRepository.save(
                    User("admin",
                            enc(adminPassword),
                            enabled = true,
                            authorities = mutableSetOf("ADMIN", "MANAGER"))
            )
        }
    }

    override fun isRegistered(name: String): Boolean {
        return userRepository.findByUsername(name) != null
    }

    private fun enc(password: String): String {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder().encode(password)
    }
}