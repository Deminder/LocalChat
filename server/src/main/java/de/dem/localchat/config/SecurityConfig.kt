package de.dem.localchat.config

import de.dem.localchat.security.dataacess.UserRepository
import de.dem.localchat.security.service.impl.UserDetailsServiceImpl
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository
import javax.sql.DataSource

@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
class SecurityConfig : WebSecurityConfigurerAdapter() {

    @Autowired
    private lateinit var persistentTokenRepository: PersistentTokenRepository

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
                .antMatchers("/api/manage").hasRole("MANAGER")
                .antMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
                .and()
                .formLogin()
                .loginPage("/")
                .loginProcessingUrl("/login")
                .and()
                .rememberMe()
                .alwaysRemember(true)
                .tokenRepository(persistentTokenRepository)
                .tokenValiditySeconds(60 * 60 * 24 * 30) // 30 days
                .and()
                .logout()
                .logoutUrl("/remove-tokens")
    }

}