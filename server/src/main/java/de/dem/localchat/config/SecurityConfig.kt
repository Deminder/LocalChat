package de.dem.localchat.config

import de.dem.localchat.filter.SecurityTokenFilter
import de.dem.localchat.security.service.impl.TokenAuthProvider
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.security.servlet.PathRequest
import org.springframework.core.env.Environment
import org.springframework.core.env.Profiles
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.web.authentication.rememberme.RememberMeAuthenticationFilter

@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
class SecurityConfig : WebSecurityConfigurerAdapter() {

    @Autowired
    private lateinit var tokenAuthProvider: TokenAuthProvider

    @Autowired
    private lateinit var securityTokenFilter: SecurityTokenFilter

    @Autowired
    private lateinit var env: Environment

    @Throws(Exception::class)
    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.authenticationProvider(tokenAuthProvider)
    }

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        if (env.acceptsProfiles(Profiles.of("prod"))) {
            http
                    .requiresChannel()
                    .anyRequest()
                    .requiresSecure()
        }
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/manage/**").hasRole("MANAGER")
                .antMatchers("/api/user/**").permitAll()
                .antMatchers("/api/**").authenticated()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                .anyRequest().permitAll()
                .and()
                .addFilterAt(securityTokenFilter, RememberMeAuthenticationFilter::class.java)
    }


}