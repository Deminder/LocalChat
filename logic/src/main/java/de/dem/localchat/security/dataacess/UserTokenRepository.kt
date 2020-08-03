package de.dem.localchat.security.dataacess

import de.dem.localchat.security.entity.UserToken
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserTokenRepository : CrudRepository<UserToken, Long> {

    fun deleteByUsername(username: String?)

    fun findBySeries(series: String?): UserToken?

    fun findAllByUsername(username: String?): List<UserToken>

    fun deleteBySeries(series: String?)
}