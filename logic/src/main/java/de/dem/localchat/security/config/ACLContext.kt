package de.dem.localchat.security.config


import net.sf.ehcache.CacheManager
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.ehcache.EhCacheFactoryBean
import org.springframework.cache.ehcache.EhCacheManagerFactoryBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler
import org.springframework.security.acls.AclPermissionCacheOptimizer
import org.springframework.security.acls.AclPermissionEvaluator
import org.springframework.security.acls.domain.*
import org.springframework.security.acls.jdbc.BasicLookupStrategy
import org.springframework.security.acls.jdbc.JdbcMutableAclService
import org.springframework.security.acls.jdbc.LookupStrategy
import org.springframework.security.acls.model.PermissionGrantingStrategy
import org.springframework.security.core.authority.SimpleGrantedAuthority
import javax.sql.DataSource

@Configuration
class ACLContext(
        @Autowired val dataSource: DataSource
) {

    @Bean
    fun aclCache(): EhCacheBasedAclCache {
        return EhCacheBasedAclCache(aclEhCacheFactoryBean().`object`, permissionGrantingStrategy(), aclAuthorizationStrategy())
    }


    @Bean
    fun aclEhCacheFactoryBean(): EhCacheFactoryBean {
        aclCacheManager().`object`?.let { manager ->
            EhCacheFactoryBean().let { factory ->
                factory.setCacheManager(manager)
                factory.setCacheName("aclCache")
                return factory
            }
        } ?: error("missing bean!")
    }

    @Bean
    fun aclCacheManager(): EhCacheManagerFactoryBean {
        return EhCacheManagerFactoryBean()
    }


    @Bean
    fun permissionGrantingStrategy(): PermissionGrantingStrategy {
        return DefaultPermissionGrantingStrategy(ConsoleAuditLogger())
    }

    @Bean
    fun aclAuthorizationStrategy(): AclAuthorizationStrategy {
        return AclAuthorizationStrategyImpl(SimpleGrantedAuthority("ROLE_ADMIN"))
    }

    @Bean
    fun defaultMethodSecurityExpressionHandler(): MethodSecurityExpressionHandler {
        val expressionHandler = DefaultMethodSecurityExpressionHandler()
        val permissionEvaluator = AclPermissionEvaluator(aclService())
        expressionHandler.setPermissionEvaluator(permissionEvaluator)
        expressionHandler.setPermissionCacheOptimizer(AclPermissionCacheOptimizer(aclService()))
        return expressionHandler
    }

    @Bean
    fun lookupStrategy(): LookupStrategy {
        return BasicLookupStrategy(dataSource, aclCache(), aclAuthorizationStrategy(), ConsoleAuditLogger())
    }

    @Bean
    fun aclService(): JdbcMutableAclService {
        return JdbcMutableAclService(dataSource, lookupStrategy(), aclCache())
    }
}