package de.dem.localchat.conversation.entity

import javax.persistence.Embeddable

@Embeddable
data class Permission(
        val read: Boolean = false,
        val write: Boolean = false,
        val voice: Boolean = false,
        val moderate: Boolean = false,
        val administrate: Boolean = false
) {
}