package de.dem.localchat.rest

import de.dem.localchat.dtos.requests.RegisterRequest
import de.dem.localchat.security.service.RegistrationService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/api/register-user")
class RegisterController(private val registrationService: RegistrationService) {


    @PostMapping("/")
    fun registerUser(@Valid registerRequest: RegisterRequest) {
        registrationService.registerUser(registerRequest.username, registerRequest.password)
    }

}