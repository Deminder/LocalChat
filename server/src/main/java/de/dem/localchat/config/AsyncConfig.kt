package de.dem.localchat.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors


@Configuration
class AsyncConfig : WebMvcConfigurer {

    override fun configureAsyncSupport(configurer: AsyncSupportConfigurer) {
        configurer.setDefaultTimeout(90_000)
    }

    @Bean
    fun requestThreadPool(): ExecutorService {
        return Executors.newCachedThreadPool()
    }

}