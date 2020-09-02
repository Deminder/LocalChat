package de.dem.localchat.security.service.impl

import de.dem.localchat.security.dataacess.UserRepository
import de.dem.localchat.security.model.LocalChatUserDetails
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(
        @Autowired val userRepository: UserRepository
) : UserDetailsService {
    override fun loadUserByUsername(username: String?): LocalChatUserDetails? {
        return username?.let {
            userRepository.findByUsername(it)?.let { user ->
                LocalChatUserDetails(user)
            }
        } ?: throw UsernameNotFoundException("User '${username}' not found!")
    }
}