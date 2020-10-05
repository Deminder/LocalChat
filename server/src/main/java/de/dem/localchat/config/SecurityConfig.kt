package de.dem.localchat.config

import de.dem.localchat.security.service.impl.UserDetailsServiceImpl
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.security.servlet.PathRequest
import org.springframework.context.annotation.Bean
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl

@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
class SecurityConfig : WebSecurityConfigurerAdapter() {

    @Bean
    fun persistentTokenRepository() = JdbcTokenRepositoryImpl().apply {
        jdbcTemplate = providedJdbcTemplate
    }

    @Autowired
    private lateinit var providedJdbcTemplate: JdbcTemplate

    @Autowired
    private lateinit var userDetailsService: UserDetailsServiceImpl


    @Throws(Exception::class)
    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsService)
    }

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/manage/**").hasRole("MANAGER")
                .antMatchers("/api/user/**").permitAll()
                .antMatchers("/api/**").authenticated()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                .anyRequest().permitAll()
                .and()
                .formLogin()
                .loginPage("/authorize")
                .loginProcessingUrl("/api/user/login")
                .and()
                .rememberMe()
                .alwaysRemember(true)
                .tokenRepository(persistentTokenRepository())
                .tokenValiditySeconds(60 * 60 * 24 * 30) // 30 days
                .and()
                .logout()
                .logoutUrl("/api/user/remove-tokens")
    }

}