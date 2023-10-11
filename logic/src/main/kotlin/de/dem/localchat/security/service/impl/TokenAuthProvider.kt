package de.dem.localchat.security.service.impl

import de.dem.localchat.security.dataaccess.UserRepository
import de.dem.localchat.security.dataaccess.UserTokenRepository
import de.dem.localchat.security.entity.LoginToken
import de.dem.localchat.security.entity.User
import de.dem.localchat.security.entity.clean
import de.dem.localchat.security.model.TokenRef
import de.dem.localchat.security.model.TokenRefToken
import de.dem.localchat.security.exception.*;
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.crypto.factory.PasswordEncoderFactories
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.security.SecureRandom

@Service
class TokenAuthProvider(
        @Autowired val userTokenRepository: UserTokenRepository,
        @Autowired val userRepository: UserRepository,
        val passwordEncoder: PasswordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder(),
        val secureRandom: SecureRandom = SecureRandom.getInstanceStrong()
) : AuthenticationProvider {

    override fun authenticate(authentication: Authentication): Authentication =
            when (authentication) {
                is UsernamePasswordAuthenticationToken -> normalLogin(authentication)
                is TokenRefToken -> autoLogin(authentication)
                else -> throw TokenAuthException("Not Supported!")
            }

    private fun normalLogin(token: UsernamePasswordAuthenticationToken): Authentication =
            userRepository.findByUsername(token.name)?.also {
                checkEnabled(it)
            }?.let { u ->
                if (passwordEncoder.matches(token.credentials.toString(), u.password))
                    successToken(TokenRef(token = createToken(u, token.details as String).token), u)
                else null
            } ?: throw TokenAuthException("Invalid username or password!")


    private fun autoLogin(token: TokenRefToken): Authentication =
            useToken(token.token)?.also {
                checkEnabled(it)
            }?.let { u ->
                successToken(token.token, u)
            } ?: throw TokenAuthException("Login token invalid!")


    private fun successToken(token: TokenRef, u: User) = TokenRefToken(
            token, u.username, auths = u.authorities.map { GrantedAuthority { "ROLE_${it}" } }).apply {
        isAuthenticated = true
    }

    private fun useToken(tokenRef: TokenRef): User? =
            userTokenRepository.userByToken(tokenRef.token)?.clean()?.also {
                userTokenRepository.updateLastUsed(tokenRef.token)
            }

    private fun checkEnabled(user: User) {
        if (!user.enabled) throw TokenAuthException("User is not enabled!")
    }

    private fun createToken(user: User, description: String) =
            userTokenRepository.save(LoginToken(
                    userId = user.id!!,
                    description = description,
                    token = secureRandom.ints().limit(8)
                            .toArray().joinToString("") { v ->
                                String.format("%08x", v)
                            }
            ))


    override fun supports(authentication: Class<*>): Boolean {
        return authentication == UsernamePasswordAuthenticationToken::class
                || authentication == TokenRefToken::class
    }
}