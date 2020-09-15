package de.dem.localchat.security.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.relational.core.mapping.MappedCollection
import java.time.Instant

data class User(
        val username: String,

        val password: String,

        val enabled: Boolean = false,

        @MappedCollection
        val authorities: Set<String> = emptySet(),

        @CreatedDate
        val registerDate: Instant = Instant.now()
) : NumericIdentity() {

}