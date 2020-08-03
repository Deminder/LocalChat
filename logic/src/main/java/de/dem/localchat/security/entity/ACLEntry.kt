package de.dem.localchat.security.entity

import de.dem.localchat.foundation.entity.NumericIdentity
import javax.persistence.*

@Entity
@Table(
        uniqueConstraints = [
            UniqueConstraint(columnNames = ["acl_object_identity", "ace_order"])
        ]
)
data class ACLEntry(
        @Column(name = "aclObjectIdentity", nullable = false)
        @ManyToOne
        val aclObjectIdentity: ACLObjectIdentity,

        @Column(nullable = false)
        val aclOrder: Int,

        @Column(name = "sid", nullable = false)
        @ManyToOne
        val sid: ACLSid,

        @Column(nullable = false)
        val mask: Int,

        @Column(nullable = false)
        val granting: Boolean,

        @Column(nullable = false)
        val auditSuccess: Boolean,

        @Column(nullable = false)
        val auditFailure: Boolean

) : NumericIdentity() {
}