package de.dem.localchat.security.model

import java.io.Serializable

data class TokenRef(
        val token: String
) : Serializable {
    companion object {
        private const val serialVersionUID: Long = 5732844442575383L
    }
}