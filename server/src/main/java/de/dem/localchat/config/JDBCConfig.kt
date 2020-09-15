package de.dem.localchat.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.auditing.DateTimeProvider
import org.springframework.data.domain.AuditorAware
import org.springframework.data.jdbc.repository.config.EnableJdbcAuditing
import org.springframework.security.core.context.SecurityContextHolder
import java.time.Instant
import java.util.*

@Configuration
@EnableJdbcAuditing(auditorAwareRef = "auditorProvider", dateTimeProviderRef = "dateTimeProvider")
class JDBCConfig {

    @Bean
    fun auditorProvider() = AuditorAware {
        Optional.ofNullable(SecurityContextHolder.getContext().authentication?.name)
    }

    @Bean
    fun dateTimeProvider() = DateTimeProvider {
        Optional.of(Instant.now())
    }

}