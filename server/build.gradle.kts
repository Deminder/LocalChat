plugins {
    id("org.flywaydb.flyway") version "6.5.5"
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

tasks.register("copyFrontend") {
    dependsOn(":server:webclient:build")
    copy {
        from("src/webclient/dist/webclient")
        into(staticDir)
    }
}

tasks.jar {
    dependsOn(tasks.getByName("copyFrontend"))
}

tasks.clean {
    delete(staticDir)
}


springBoot {
    mainClassName = "de.dem.localchat.LocalChatApplicationKt"
}

dependencies {
    runtimeOnly(project(":server:webclient"))
    implementation(project(":logic"))
    implementation("org.flywaydb:flyway-core:6.5.5")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("io.springfox:springfox-boot-starter:3.0.0")
    implementation("io.springfox:springfox-swagger-ui:3.0.0")
}


