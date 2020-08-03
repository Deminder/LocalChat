package de.dem.localchat.security.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import javax.persistence.*

@Entity
@Table(
        uniqueConstraints = [
            UniqueConstraint(columnNames = ["sid", "principal"])
        ]
)
data class ACLObjectIdentity(
        @Column(name = "objectIdClass", nullable = false)
        @ManyToOne
        val objectIdClass: ACLClass = ACLClass(),

        @Column(nullable = false)
        val objectIdIdentity: Long = -1,

        @ManyToOne
        val parentObject: ACLObjectIdentity? = null,

        @ManyToOne
        val ownerSid: ACLSid? = null,

        @Column(nullable = false)
        val entitiesInheriting: Boolean = false
) : NumericIdentity() {
}