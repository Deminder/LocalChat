package de.dem.localchat.dtos

data class PermissionDto(
    val read: Boolean = false,
    val write: Boolean = false,
    val voice: Boolean = false,
    val moderate: Boolean = false,
    val administrate: Boolean = false
) {
}