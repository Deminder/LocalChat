package de.dem.localchat.security.dataacess

import de.dem.localchat.security.entity.User
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : CrudRepository<User, Long> {
    fun findByUsername(username: String?): User?

    @Modifying
    @Query("UPDATE User u SET u.enabled = false WHERE u.username = ?1")
    fun deactivateUser(username: String)

    @Modifying
    @Query("UPDATE User u SET u.enabled = true WHERE u.username = ?1")
    fun enableUser(username: String)
}