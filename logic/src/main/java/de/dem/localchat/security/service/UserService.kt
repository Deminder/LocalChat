package de.dem.localchat.security.service

import de.dem.localchat.security.entity.User
import org.springframework.data.repository.query.Param
import org.springframework.security.access.prepost.PreAuthorize

interface UserService {
    fun registerUser(name: String, password: String)

    fun changePassword(password: String)

    @PreAuthorize("#username == authentication.name")
    fun deleteUser(@Param("username") name: String)

    fun initAdmin()
    fun isRegistered(name: String): Boolean
    fun userByName(username: String): User?
    fun searchVisibleUsers(username: String, search: String): List<User>
}