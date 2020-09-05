package de.dem.localchat.security.entity

import java.time.ZonedDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class UserToken(
        @Id
        val series: String = "123",

        @Column(nullable = false)
        val username: String = "user",

        @Column(nullable = false)
        val token: String = "abcdef",

        val lastUsed: ZonedDateTime = ZonedDateTime.now()
) {
}