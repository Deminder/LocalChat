package de.dem.localchat.security.service.impl

import de.dem.localchat.security.dataaccess.UserRepository
import de.dem.localchat.security.dataaccess.UserTokenRepository
import de.dem.localchat.security.entity.LoginToken
import de.dem.localchat.security.entity.User
import de.dem.localchat.security.entity.clean
import de.dem.localchat.security.model.TokenRef
import de.dem.localchat.security.model.TokenRefToken
import de.dem.localchat.security.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.factory.PasswordEncoderFactories
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
class UserServiceImpl(
    @Autowired val userRepository: UserRepository,
    @Autowired val userTokenRepository: UserTokenRepository,
    @Value("\${manage.admin.password:admin}") val adminPassword: String,
    @Autowired val authProvider: AuthenticationProvider,
    val passwordEncoder: PasswordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder(),
) : UserService {

    @Transactional
    override fun registerUser(name: String, password: String): User =
        if (isRegistered(name))
            error("User '${name}' already exists!")
        else
            userRepository.save(
                User(
                    username = name,
                    password = enc(password),
                    authorities = setOf("USER")
                )
            )


    override fun changePassword(password: String, oldPassword: String) {
        val name = SecurityContextHolder.getContext().authentication?.name ?: error("Not authenticated!")
        userRepository.findByUsername(name)?.let {
            if (passwordEncoder.matches(oldPassword, it.password))
                userRepository.save(it.copy(password = enc(password)))
            else error("Old password is incorrect!")
        } ?: error("User '${name}' not found!")
    }

    override fun deleteUser(name: String) {
        userRepository.findByUsername(name)?.let {
            userRepository.delete(it)
        }

    }

    @Transactional
    override fun initAdmin() {
        userRepository.save(
            userRepository.findByUsername("admin")
                ?.copy(password = enc(adminPassword))
                ?.clean()
                ?: User(
                    username = "admin",
                    password = enc(adminPassword),
                    enabled = true,
                    authorities = setOf("ADMIN", "MANAGER")
                )
        )

    }

    override fun isRegistered(name: String) = userRepository.findByUsername(name) != null

    override fun userByName(username: String) = userRepository.findByUsername(username)

    override fun searchVisibleUsers(username: String, search: String) =
        userRepository.findVisibleUsersOf(username, search)


    override fun login(username: String, password: String, description: String): TokenRef =
        authProvider.authenticate(
            UsernamePasswordAuthenticationToken(username, password).also {
                it.details = description
            }
        ).also { auth ->
            SecurityContextHolder.getContext().authentication = auth
        }.let {
            (it as TokenRefToken).token
        }

    override fun logout() {
        SecurityContextHolder.getContext().authentication?.let {
            if (it is TokenRefToken) {
                removeToken(it.token)
            }
        }
        SecurityContextHolder.clearContext()
    }

    override fun removeToken(tokenRef: TokenRef) {
        userTokenRepository.deleteByToken(tokenRef.token)
    }

    override fun listUserTokens(username: String): List<LoginToken> =
        userTokenRepository.findAllByUsername(username)

    private fun enc(password: String) = passwordEncoder.encode(password)
}