package de.dem.localchat.security.entity

import java.time.ZonedDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class UserToken(
        @Id
        val series: String,

        @Column(nullable = false)
        val username: String,

        @Column(nullable = false)
        val token: String,

        val lastUsed: ZonedDateTime
) {
}