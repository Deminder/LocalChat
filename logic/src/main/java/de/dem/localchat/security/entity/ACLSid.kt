package de.dem.localchat.security.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import javax.persistence.*

@Entity
@Table(
        uniqueConstraints = [
            UniqueConstraint(columnNames = ["sid", "principal"])
        ]
)
data class ACLSid(
        @Column(nullable = false)
        val principal: Boolean,

        @Column(nullable = false)
        val sid: String
) : NumericIdentity() {
}