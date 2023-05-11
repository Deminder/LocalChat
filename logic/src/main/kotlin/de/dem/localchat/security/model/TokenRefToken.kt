package de.dem.localchat.security.model

import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority

data class TokenRefToken(
        val token: TokenRef,
        val userName: String = "?",
        val maxAge: Int = 60 * 60 * 24 * 30, // 30 days
        private val auths: Collection<GrantedAuthority>? = null
) : AbstractAuthenticationToken(auths) {

    companion object {
        private const val serialVersionUID: Long = 57328932575383L
    }

    override fun getCredentials() = token

    override fun getPrincipal() = userName

}