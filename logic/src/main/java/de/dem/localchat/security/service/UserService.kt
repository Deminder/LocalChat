package de.dem.localchat.security.service

import de.dem.localchat.security.entity.LoginToken
import de.dem.localchat.security.entity.User
import de.dem.localchat.security.model.TokenRef
import org.springframework.data.repository.query.Param
import org.springframework.security.access.prepost.PreAuthorize

interface UserService {
    fun registerUser(name: String, password: String): User

    fun changePassword(password: String, oldPassword: String)

    @PreAuthorize("#username == authentication.name")
    fun deleteUser(@Param("username") name: String)

    fun initAdmin()
    fun isRegistered(name: String): Boolean
    fun userByName(username: String): User?
    fun searchVisibleUsers(username: String, search: String): List<User>

    fun login(username: String, password: String, description: String): TokenRef

    fun logout()
    fun removeToken(tokenRef: TokenRef)
    fun listUserTokens(username: String): List<LoginToken>
}