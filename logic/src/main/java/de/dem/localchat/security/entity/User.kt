package de.dem.localchat.security.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.hibernate.annotations.NaturalId
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.ZonedDateTime
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
data class User(
        @NaturalId
        val username: String = "user",

        @Column(nullable = false)
        val password: String = "ee7ab",

        @Column(nullable = false)
        var enabled: Boolean = false,

        @ElementCollection
        @CollectionTable(
                name = "authority",
                joinColumns = [JoinColumn(name = "user_id")]
        )
        @Column(name = "role")
        val authorities: MutableSet<String> = mutableSetOf(),
        @CreatedDate
        val registerDate: ZonedDateTime = ZonedDateTime.now()
) : NumericIdentity() {

}