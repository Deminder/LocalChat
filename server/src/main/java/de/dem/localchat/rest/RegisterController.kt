package de.dem.localchat.rest

import de.dem.localchat.dtos.requests.RegisterRequest
import de.dem.localchat.management.service.ManagementService
import de.dem.localchat.security.entity.User
import de.dem.localchat.security.service.RegistrationService
import io.swagger.v3.oas.annotations.parameters.RequestBody
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/register-user")
class RegisterController(private val registrationService: RegistrationService) {


    @PostMapping("/")
    fun registerUser( @RequestBody @Valid registerRequest: RegisterRequest) {
        registrationService.registerUser(registerRequest.username, registerRequest.password)
    }

}