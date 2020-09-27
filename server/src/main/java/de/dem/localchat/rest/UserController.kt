package de.dem.localchat.rest

import de.dem.localchat.dtos.UserDto
import de.dem.localchat.dtos.UserGetResponse
import de.dem.localchat.dtos.UserSearchResponse
import de.dem.localchat.dtos.requests.RegisterRequest
import de.dem.localchat.dtos.requests.UserGetRequest
import de.dem.localchat.dtos.requests.UserSearchRequest
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
    fun selfUser(): UserDto =
            userService.userByName(username())?.toUserDts() ?: error("Registration error!")


    @PostMapping("/search")
    fun searchUser(@RequestBody @Valid req: UserSearchRequest): UserSearchResponse =
            UserSearchResponse(userService.searchVisibleUsers(username(), req.search).map {
                it.username
            })

    @PostMapping("/one")
    fun getOne(@RequestBody @Valid req: UserGetRequest): UserGetResponse =
            UserGetResponse(userService.userByName(req.username)?.id ?: -1)

    private fun username() = SecurityContextHolder.getContext().authentication?.name ?: error("Not logged in user!")

}