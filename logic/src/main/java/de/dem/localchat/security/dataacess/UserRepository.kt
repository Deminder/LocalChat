package de.dem.localchat.security.dataacess

import de.dem.localchat.security.entity.User
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : CrudRepository<User, Long> {
    fun findByName(name: String?): User?
}