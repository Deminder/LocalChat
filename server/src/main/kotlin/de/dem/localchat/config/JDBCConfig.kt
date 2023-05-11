package de.dem.localchat.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.data.auditing.DateTimeProvider
import org.springframework.data.convert.ReadingConverter
import org.springframework.data.domain.AuditorAware
import org.springframework.data.jdbc.core.convert.JdbcCustomConversions
import org.springframework.data.jdbc.repository.config.AbstractJdbcConfiguration
import org.springframework.data.jdbc.repository.config.EnableJdbcAuditing
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.datasource.DataSourceTransactionManager
import org.springframework.security.core.context.SecurityContextHolder
import java.time.Instant
import java.util.*
import javax.sql.DataSource


@Configuration
@EnableJdbcAuditing(auditorAwareRef = "auditorProvider", dateTimeProviderRef = "dateTimeProvider")
class JDBCConfig : AbstractJdbcConfiguration() {

    @Bean
    fun auditorProvider() = AuditorAware {
        Optional.ofNullable(SecurityContextHolder.getContext().authentication?.name)
    }

    @Bean
    fun dateTimeProvider() = DateTimeProvider {
        Optional.of(Instant.now())
    }

    @Bean
    fun namedParameterJdbcOperations(dataSource: DataSource) = NamedParameterJdbcTemplate(dataSource)

    @Bean
    fun transactionManager(dataSource: DataSource) = DataSourceTransactionManager(dataSource)

    override fun jdbcCustomConversions() =
        JdbcCustomConversions(listOf(StringSetReader.INSTANCE))


    @ReadingConverter
    internal enum class StringSetReader : Converter<String, Set<String>> {

        INSTANCE;

        override fun convert(source: String): Set<String> = source
            .subSequence(1, source.length - 1)
            .split(",")
            .toSet()
    }

}