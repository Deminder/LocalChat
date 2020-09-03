package de.dem.localchat.security.dataacess

import de.dem.localchat.security.entity.UserToken
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.util.*

@Component
class PersistentTokenRepositoryImpl(
        @Autowired val userTokenRepository: UserTokenRepository
) : PersistentTokenRepository {

    override fun updateToken(series: String, tokenValue: String, lastUsed: Date) {
        userTokenRepository.findBySeries(series)?.let {
            userTokenRepository.save(UserToken(
                    series = series,
                    username = it.username,
                    token = tokenValue,
                    lastUsed = LocalDateTime.from(lastUsed.toInstant())
            ))
        }
    }

    override fun getTokenForSeries(series: String?): PersistentRememberMeToken? {
        return userTokenRepository.findBySeries(series)?.let {
            PersistentRememberMeToken(it.series,
                    it.username,
                    it.token,
                    Date.from(
                            it.lastUsed.toInstant(ZoneId.systemDefault() as ZoneOffset?)
                    )
            )
        }

    }

    override fun removeUserTokens(username: String?) {
        userTokenRepository.deleteByUsername(username)
    }


    override fun createNewToken(token: PersistentRememberMeToken) {
        userTokenRepository.save(UserToken(
                series = token.series,
                username = token.username,
                token = token.tokenValue,
                lastUsed = token.date
                        .toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime()
        ))
    }
}