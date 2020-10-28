package de.dem.localchat.rest

import de.dem.localchat.dtos.*
import de.dem.localchat.dtos.requests.*
import de.dem.localchat.security.model.TokenRef
import de.dem.localchat.security.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import javax.servlet.http.HttpServletRequest
import javax.validation.Valid

@RestController
@RequestMapping("/api/user")
class UserController(private val userService: UserService) {


    @PostMapping("/register")
    fun registerUser(@RequestBody @Valid registerRequest: RegisterRequest) {
        if (registerRequest.username == username()) {
            error("This username is taken by the anonymous spring user!")
        }
        userService.registerUser(registerRequest.username, registerRequest.password)
    }

    @GetMapping("/self")
    fun selfUser(): UserDto =
            userService.userByName(username())?.toUserDts()
                    ?: throw ResponseStatusException(HttpStatus.FORBIDDEN, "You are not logged in!")


    @GetMapping("/tokens")
    fun allTokens(): LoginTokenListResponse =
            LoginTokenListResponse(tokens = userService.listUserTokens(username()).map { it.toLoginTokenDto() })

    @DeleteMapping("/tokens/{id}")
    fun allTokens(@PathVariable tid: Long) {
        userService.listUserTokens(username()).find { it.id == tid }?.let {
            userService.removeToken(TokenRef(token = it.token))
        } ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "No such token!")
    }

    @PostMapping("/search")
    fun searchUser(@RequestBody @Valid req: UserSearchRequest): UserSearchResponse =
            UserSearchResponse(userService.searchVisibleUsers(username(), req.search).map {
                it.username
            })

    @PostMapping("/one")
    fun getOne(@RequestBody @Valid req: UserGetRequest): UserGetResponse =
            UserGetResponse(userService.userByName(req.username)?.id ?: -1)

    @PostMapping("/login")
    fun login(@RequestBody @Valid req: LoginRequest, httpReq: HttpServletRequest) {
        userService.login(req.username, req.password,
                "[${httpReq.remoteAddr}] ${httpReq.getHeader("User-Agent")}")
    }

    @PostMapping("/logout")
    fun logout() {
        userService.logout()
    }

    @PostMapping("/change-password")
    fun changePassword(@RequestBody @Valid req: ChangePasswordRequest) {
        userService.changePassword(req.password, req.oldPassword)
    }


    private fun username() = SecurityContextHolder.getContext().authentication?.name
            ?: throw ResponseStatusException(HttpStatus.FORBIDDEN, "Not logged in user!")

}