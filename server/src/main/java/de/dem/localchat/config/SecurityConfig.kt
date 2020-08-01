package de.dem.localchat.config

import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter


@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
class SecurityConfig : WebSecurityConfigurerAdapter() {

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/manage").hasRole("manager")
                .antMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
                .and()
                .formLogin().successForwardUrl("/api/manage")
                .and()
                .logout().logoutSuccessUrl("/logout")
    }
}