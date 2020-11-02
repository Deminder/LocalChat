package de.dem.localchat.filter

import de.dem.localchat.security.model.TokenRef
import de.dem.localchat.security.model.TokenRefToken
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.env.ConfigurableEnvironment
import org.springframework.core.env.Environment
import org.springframework.core.env.Profiles
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import javax.naming.AuthenticationException
import javax.servlet.FilterChain
import javax.servlet.http.Cookie
import javax.servlet.http.HttpFilter
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


@Component
class SecurityTokenFilter(
        @Autowired val authenticationProvider: AuthenticationProvider,
        @Autowired val env: Environment
) : HttpFilter() {

    val cookieName = "API-Token"

    override fun doFilter(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        val reqCookie = request.cookies?.find { c -> c.name == cookieName }


        // check for token cookie (if not yet authenticated)
        if (SecurityContextHolder.getContext().authentication?.isAuthenticated != true)
            reqCookie?.let {
                try {
                    authenticationProvider.authenticate(TokenRefToken(TokenRef(it.value)))
                } catch (ex: AuthenticationException) {
                    null
                }
            }.also { auth ->
                SecurityContextHolder.getContext().authentication = auth
            }


        chain.doFilter(request, response)

        // add token cookie (if authenticated) OR remove cookie (if not authenticated)
        val auth = SecurityContextHolder.getContext().authentication
        val addC = auth != null && auth.isAuthenticated && auth is TokenRefToken
        val remC = reqCookie != null && (auth == null || !auth.isAuthenticated)
        if (addC || remC) {
            response.addCookie(Cookie(cookieName,
                    if (auth is TokenRefToken) auth.token.token else "x"
            ).apply {
                isHttpOnly = true
                secure = env.acceptsProfiles( Profiles.of("prod") )
                path = "/api"
                maxAge = if (addC && auth is TokenRefToken) auth.maxAge else 0
            })
        }

    }


}