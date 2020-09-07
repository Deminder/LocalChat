plugins {
    id("org.liquibase.gradle") version "2.0.3"
}

val staticDir = "build/resources/main/static/"

tasks.register("copyFrontend") {
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

tasks.diff {
    dependsOn(tasks.compileKotlin)
}

tasks.diffChangeLog {
    dependsOn(tasks.compileKotlin)
}

liquibase {
    activities.register("diffMain") {
        arguments = mapOf(
                "logLevel" to "info",
                "url" to "jdbc:postgresql://localhost:5432/postgres?currentSchema=public",
                "defaultSchemaName" to "public",
                "username" to "admin",
                "password" to "secret",
                "driver" to "org.postgresql.Driver",
                "referenceUrl" to "hibernate:spring:de.dem.localchat" +
                        "?dialect=org.hibernate.dialect.PostgreSQL82Dialect" +
                        "&hibernate.physical_naming_strategy=org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy" +
                        "&hibernate.implicit_naming_strategy=org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy",
                "changeLogFile" to "src/main/resources/db/changelog/db.changelog-master-diff.yaml"
        )
    }
}

springBoot {
    mainClassName = "de.dem.localchat.LocalChatApplicationKt"
}

dependencies {
    runtimeOnly(project(":server:webclient"))
    implementation(project(":logic"))
    implementation("org.liquibase:liquibase-core")
    implementation("org.springframework.boot:spring-boot-starter-data-rest")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("io.springfox:springfox-swagger2:3.0.0")
    implementation("io.springfox:springfox-swagger-ui:3.0.0")
    implementation("io.springfox:springfox-bean-validators:3.0.0")
    liquibaseRuntime("org.springframework.boot:spring-boot-starter-data-jpa")
    liquibaseRuntime("org.liquibase:liquibase-core:3.8.9")
    liquibaseRuntime("org.postgresql:postgresql:42.2.14")
    liquibaseRuntime("javax.validation:validation-api:2.0.1.Final")
    liquibaseRuntime("org.liquibase.ext:liquibase-hibernate5:3.6")
    liquibaseRuntime("ch.qos.logback:logback-core:1.2.3")
    liquibaseRuntime("ch.qos.logback:logback-classic:1.2.3")
    liquibaseRuntime(project(":logic"))
    liquibaseRuntime(project(":server"))
}


