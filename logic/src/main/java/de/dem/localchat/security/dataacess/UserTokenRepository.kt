package de.dem.localchat.security.dataacess

import de.dem.localchat.security.entity.LoginToken
import de.dem.localchat.security.entity.User
import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserTokenRepository : CrudRepository<LoginToken, String> {

    @Modifying
    @Query("DELETE FROM login_token l WHERE l.token = :token")
    fun deleteByToken(token: String)

    @Query("SELECT u.* FROM login_token l, \"user\" u WHERE l.user_id = u.id AND l.token = :token")
    fun userByToken(token: String): User?

    fun findByToken(token: String): LoginToken?

    @Modifying
    @Query("UPDATE login_token SET last_used = NOW() WHERE token = :token")
    fun updateLastUsed(token: String)
}