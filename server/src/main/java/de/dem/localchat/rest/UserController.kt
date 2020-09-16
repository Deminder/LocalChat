package de.dem.localchat.rest

import de.dem.localchat.dtos.requests.RegisterRequest
import de.dem.localchat.dtos.toUserDts
import de.dem.localchat.security.service.UserService
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/api/user")
class UserController(private val userService: UserService) {


    @PostMapping("/register")
    fun registerUser(@Valid registerRequest: RegisterRequest) {
        userService.registerUser(registerRequest.username, registerRequest.password)
    }

    @GetMapping("/self")
    fun selfUser() = userService.userByName(username())?.toUserDts() ?: error("Not logged in user!")

    private fun username() = SecurityContextHolder.getContext().authentication?.name ?: "[Unknown]"

}