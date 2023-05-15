plugins {
    id("org.flywaydb.flyway") version "9.8.1"
}

flyway {
    url = "jdbc:postgresql://localhost:5432/postgres?currentSchema=public"
    user = "admin"
    password = "secret"
    locations = arrayOf("classpath:db/migration")
}

tasks.flywayMigrate {
    dependsOn(tasks.classes)
}


val staticDir = "build/resources/main/static/"
val copyFrontend by tasks.registering {
    doFirst {
        delete(staticDir)
    }
    doLast {
        copy {
            from("src/webclient/dist/webclient")
            into(staticDir)
        }
    }
}

copyFrontend {
    dependsOn(":server:webclient:assembleFrontend")
}

tasks.processResources {
    dependsOn(copyFrontend)
}

tasks.clean {
    delete(staticDir)
}

dependencies {
    runtimeOnly(project(":server:webclient"))
    implementation(project(":logic"))
    implementation("org.flywaydb:flyway-core:9.8.1")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0")
}


