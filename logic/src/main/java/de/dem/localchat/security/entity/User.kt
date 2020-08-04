package de.dem.localchat.security.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.hibernate.annotations.NaturalId
import javax.persistence.*

@Entity
data class User(
        @NaturalId
        val username: String = "user",

        @Column(nullable = false)
        val password: String = "ee7ab",

        @Column(nullable = false)
        val enabled: Boolean = true,

        @ElementCollection
        @CollectionTable(
                name = "authority",
                joinColumns = [JoinColumn(name = "user_id")]
        )
        @Column(name = "role")
        val authorities: Set<String> = emptySet()
) : NumericIdentity() {

}