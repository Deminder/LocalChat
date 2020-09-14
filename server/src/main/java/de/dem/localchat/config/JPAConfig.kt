package de.dem.localchat.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.auditing.DateTimeProvider
import org.springframework.data.domain.AuditorAware
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import org.springframework.security.core.context.SecurityContextHolder
import java.time.Instant
import java.util.*

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider", dateTimeProviderRef = "dateTimeProvider")
class JPAConfig {

    @Bean
    fun auditorProvider() = AuditorAware {
        Optional.ofNullable(SecurityContextHolder.getContext().authentication?.name)
    }

    @Bean
    fun dateTimeProvider() = DateTimeProvider {
        Optional.of(Instant.now())
    }

}