package de.dem.localchat.security.dataacess

import de.dem.localchat.security.entity.User
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : CrudRepository<User, Long> {

    @Query("SELECT u.* FROM \"user\" u WHERE LOWER(u.username) = LOWER(:username)")
    fun findByUsername(username: String): User?
}