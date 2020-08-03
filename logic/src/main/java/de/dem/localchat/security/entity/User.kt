package de.dem.localchat.security.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import org.hibernate.annotations.NaturalId
import javax.persistence.Column
import javax.persistence.ElementCollection
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class User(
        @NaturalId
        val username: String = "user",

        @Column(nullable = false)
        val password: String = "ee7ab",

        @Column(nullable = false)
        val enabled: Boolean = true,

        @ElementCollection
        val authorities: Set<String> = emptySet()
) : NumericIdentity(){

}