package de.dem.localchat.rest

import de.dem.localchat.dtos.UserDts
import de.dem.localchat.dtos.requests.RegisterRequest
import de.dem.localchat.dtos.toUserDts
import de.dem.localchat.security.service.UserService
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@RequestMapping("/api/user")
class UserController(private val userService: UserService) {


    @PostMapping("/register")
    fun registerUser(@RequestBody @Valid registerRequest: RegisterRequest) {
        userService.registerUser(registerRequest.username, registerRequest.password)
    }

    @GetMapping("/self")
    fun selfUser(): UserDts =
            userService.userByName(username())?.toUserDts() ?: error("Not logged in user!")

    private fun username() = SecurityContextHolder.getContext().authentication?.name ?: "[Unknown]"

}