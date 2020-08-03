package de.dem.localchat.security.model

import de.dem.localchat.security.entity.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class LocalChatUserDetails(
        val user: User
) : UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return user.authorities.map {
            GrantedAuthority { -> it }
        }.toMutableList()
    }

    override fun isEnabled(): Boolean {
        return user.enabled
    }

    override fun getUsername(): String {
        return user.username
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun getPassword(): String {
        return user.password
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }
}