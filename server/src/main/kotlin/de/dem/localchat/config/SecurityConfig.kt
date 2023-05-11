package de.dem.localchat.config

import de.dem.localchat.filter.SecurityTokenFilter
import de.dem.localchat.security.service.impl.TokenAuthProvider
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.security.servlet.PathRequest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.core.env.Environment
import org.springframework.core.env.Profiles
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.rememberme.RememberMeAuthenticationFilter

@Configuration
class SecurityConfig {

    @Autowired
    private lateinit var tokenAuthProvider: TokenAuthProvider

    @Autowired
    private lateinit var securityTokenFilter: SecurityTokenFilter

    @Autowired
    private lateinit var env: Environment

    @Primary
    @Bean
    @Throws(Exception::class)
    fun tokenAuthManager(auth: AuthenticationManagerBuilder): AuthenticationManagerBuilder {
        return auth.authenticationProvider(tokenAuthProvider)
    }

    @Bean
    @Throws(Exception::class)
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        return if (env.acceptsProfiles(Profiles.of("prod"))) {
            http
                .requiresChannel()
                .anyRequest()
                .requiresSecure()
                .and()
        } else {
            http
        }.csrf().disable()
            .authorizeHttpRequests {
                it.requestMatchers("/api/manage/**").hasAnyRole("ADMIN", "MANAGER")
                    .requestMatchers("/api/user/**").permitAll()
                    .requestMatchers("/api/**").authenticated()
                    .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                    .anyRequest().permitAll()
            }
            .addFilterAt(securityTokenFilter, RememberMeAuthenticationFilter::class.java)
            .build()
    }


}