package de.dem.localchat.config

import de.dem.localchat.conversation.exception.ConversationException
import de.dem.localchat.dtos.ErrorMessageDto
import de.dem.localchat.security.exception.TokenAuthException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.AuthenticationException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@ControllerAdvice
class RestExceptionHandler : ResponseEntityExceptionHandler() {

    @ExceptionHandler
    fun handleConversationException(ex: ConversationException) = ResponseEntity(
        ErrorMessageDto(HttpStatus.BAD_REQUEST.value(), ex.message), HttpStatus.BAD_REQUEST
    )

    @ExceptionHandler
    fun handleAuthenticationException(ex: AuthenticationException) = ResponseEntity(
        ErrorMessageDto(HttpStatus.FORBIDDEN.value(), ex.message ?: "Access Denied"), HttpStatus.FORBIDDEN
    )
}