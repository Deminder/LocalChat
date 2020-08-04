package de.dem.localchat.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository
import javax.sql.DataSource

@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
class SecurityConfig : WebSecurityConfigurerAdapter() {
    @Autowired
    private lateinit var dataSource: DataSource

    @Autowired
    private lateinit var persistentTokenRepository: PersistentTokenRepository

    @Autowired
    private lateinit var userDetailsService: UserDetailsService

    @Throws(Exception::class)
    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.jdbcAuthentication()
                .dataSource(dataSource)
                .usersByUsernameQuery("select username, password, enabled from user where username = ?")
                .authoritiesByUsernameQuery("select username, role from authority where username = ?")
                .and()
                .userDetailsService(userDetailsService)
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