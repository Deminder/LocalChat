package de.dem.localchat.security.exception

import org.springframework.security.core.AuthenticationException

class TokenAuthException(msg: String) : AuthenticationException(msg) {
}