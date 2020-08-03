package de.dem.localchat.security.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import javax.persistence.*

@Entity
@Table(
        uniqueConstraints = [
            UniqueConstraint(columnNames = ["class"])
        ]
)
data class ACLClass(
        @Column(name = "class", nullable = false)
        val clazz: String = ""
) : NumericIdentity() {
}