package de.dem.localchat.filter

import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import java.util.regex.Pattern
import javax.servlet.Filter
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest


@Component
@Order(1)
class FrontendForwardFilter : Filter {
    private val frontendPattern = Pattern.compile(
            "^/(?!api/|v2/|null/|webjars/|swagger-resources|csrf)[^.]+$"
    )

    override fun doFilter(req: ServletRequest, resp: ServletResponse, chain: FilterChain) =
            when (frontendPattern.matcher(
                    (req as HttpServletRequest).requestURI
            ).matches()) {
                true -> req.getRequestDispatcher("/")
                        .forward(req, resp)
                else -> chain.doFilter(req, resp)
            }

}