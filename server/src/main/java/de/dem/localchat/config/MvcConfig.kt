package de.dem.localchat.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.info.License
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors


@Configuration
class MvcConfig : WebMvcConfigurer {

    override fun configureAsyncSupport(configurer: AsyncSupportConfigurer) {
        configurer.setDefaultTimeout(90_000)
    }

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry
            .addResourceHandler("/**")
            .addResourceLocations("classpath:/static/")
    }

    @Bean
    fun requestThreadPool(): ExecutorService {
        return Executors.newCachedThreadPool()
    }

    @Bean
    fun localChatOpenAPI(): OpenAPI {
        return OpenAPI()
            .info(
                Info().title("Local Chat API")
                    .description("Local network chatting application")
                    .version("v1.1.0")
                    .license(License().name("MIT").url("https://github.com/Deminder/LocalChat"))
            )
    }

}