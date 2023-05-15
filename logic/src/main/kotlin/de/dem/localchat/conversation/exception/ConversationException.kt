package de.dem.localchat.conversation.exception

class ConversationException(
        override val message: String
) : IllegalArgumentException(message) {
}

fun invalid(message: String): Nothing = throw ConversationException(message)