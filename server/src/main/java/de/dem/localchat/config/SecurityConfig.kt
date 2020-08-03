package de.dem.localchat.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Configurable
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.crypto.factory.PasswordEncoderFactories
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository
import javax.sql.DataSource


@EnableWebSecurity
class SecurityConfig(
        @Autowired private val dataSource: DataSource,
        @Autowired private val persistentTokenRepository: PersistentTokenRepository
) : WebSecurityConfigurerAdapter() {


    @Throws(Exception::class)
    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.jdbcAuthentication()
                .dataSource(dataSource)
                .withDefaultSchema()
    }

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/manage").hasRole("manager")
                .antMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
                .and()
                .formLogin()
                .successForwardUrl("/api/manage")
                .and()
                .rememberMe()
                .alwaysRemember(true)
                .tokenRepository(persistentTokenRepository)
                .tokenValiditySeconds(60 * 60 * 24 * 30) // 30 days
                .and()
                .logout()
                .logoutSuccessUrl("/logout")
    }
}