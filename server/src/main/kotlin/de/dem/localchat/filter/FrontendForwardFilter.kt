package de.dem.localchat.filter

import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import java.util.regex.Pattern
import jakarta.servlet.Filter
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest


@Component
@Order(1)
class FrontendForwardFilter : Filter {
    private val frontendPattern = Pattern.compile(
        "^/(?!api/|v2/|null/|webjars/|swagger-resources|csrf)[^.]*$"
    )

    override fun doFilter(req: ServletRequest, resp: ServletResponse, chain: FilterChain) =
        if (frontendPattern.matcher((req as HttpServletRequest).requestURI).matches())
            req.getRequestDispatcher("/index.html").forward(req, resp)
        else chain.doFilter(req, resp)


}