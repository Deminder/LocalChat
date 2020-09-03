package de.dem.localchat.security.service

import org.springframework.data.repository.query.Param
import org.springframework.security.access.prepost.PreAuthorize

interface RegistrationService {
    fun registerUser(name: String, password: String)

    @PreAuthorize("#username == authentication.name")
    fun deleteUser(@Param("username") name: String)

    fun initAdmin()
    fun isRegistered(name: String): Boolean
}