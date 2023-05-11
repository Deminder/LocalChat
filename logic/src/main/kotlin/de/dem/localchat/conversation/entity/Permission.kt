package de.dem.localchat.conversation.entity


data class Permission(
        val read: Boolean = false,
        val write: Boolean = false,
        val voice: Boolean = false,
        val moderate: Boolean = false,
        val administrate: Boolean = false
)