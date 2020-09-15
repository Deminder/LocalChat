package de.dem.localchat

import org.springframework.boot.Banner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.data.jdbc.repository.config.EnableJdbcRepositories
import org.springframework.transaction.annotation.EnableTransactionManagement

@SpringBootApplication
@EnableJdbcRepositories
@EnableTransactionManagement
@EnableConfigurationProperties
class LocalChatApplication

fun main(args: Array<String>) {
    runApplication<LocalChatApplication>(*args) {
        setBannerMode(Banner.Mode.OFF)
    }
}