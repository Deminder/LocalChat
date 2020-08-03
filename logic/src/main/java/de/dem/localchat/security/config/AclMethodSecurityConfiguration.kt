package de.dem.localchat.security.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration


@EnableGlobalMethodSecurity(prePostEnabled = true)
class AclMethodSecurityConfiguration(
        @Autowired val methodSecurityExpressionHandler: MethodSecurityExpressionHandler
) : GlobalMethodSecurityConfiguration() {

    override fun createExpressionHandler(): MethodSecurityExpressionHandler? {
        return methodSecurityExpressionHandler
    }
}