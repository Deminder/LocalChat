plugins {
    idea
    id("org.springframework.boot") version "3.0.1"
    id("io.spring.dependency-management") version "1.1.0"
    kotlin("jvm") version "1.8.21"
    kotlin("plugin.spring") version "1.8.0"
    id("org.springdoc.openapi-gradle-plugin") version "1.6.0"
}

idea {
    module {
        isDownloadSources = true
        isDownloadJavadoc = true
    }
}

kotlin {
    jvmToolchain(17)
}

tasks.bootJar {
    enabled = false
}

tasks.jar {
    enabled = false
}

allprojects {
    group = "de.dem.localchat"
    version = "1.2"

    repositories {
        mavenCentral()
    }
}

tasks.register("printVersion") {
    doFirst {
        println("version: $version")
    }
}

subprojects {

}

configure(subprojects.filter { it.name != "webclient" }) {
    println("Project name: ${this.name}")
    apply(plugin = "org.jetbrains.kotlin.jvm")
    apply(plugin = "org.jetbrains.kotlin.plugin.spring")
    apply(plugin = "org.springframework.boot")
    apply(plugin = "io.spring.dependency-management")

    dependencies {
        implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
        implementation("org.springframework.boot:spring-boot-starter-security")
        implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
        implementation("org.jetbrains.kotlin:kotlin-reflect")
        developmentOnly("org.springframework.boot:spring-boot-devtools")
        runtimeOnly("org.postgresql:postgresql")
        testImplementation("com.ninja-squad:springmockk:4.0.0")
        testImplementation("org.springframework.boot:spring-boot-starter-test") {
            exclude(group = "org.junit.vintage", module = "junit-vintage-engine")
        }
        testImplementation("org.junit.jupiter:junit-jupiter-engine:5.9.3")
        testImplementation("org.springframework.security:spring-security-test")
        testImplementation("io.zonky.test:embedded-database-spring-test:2.2.0")
    }

    tasks.test {
        useJUnitPlatform()
    }

    ext {
        set("testcontainersVersion", "1.16.3")
    }

    dependencyManagement {
        imports {
            mavenBom("org.testcontainers:testcontainers-bom:${property("testcontainersVersion")}")
        }
    }

    fun String.runCommand(
        workingDir: File = File("."),
        timeoutAmount: Long = 60,
        timeoutUnit: TimeUnit = TimeUnit.SECONDS
    ): String? = runCatching {
        ProcessBuilder("\\s".toRegex().split(this))
            .directory(workingDir)
            .redirectOutput(ProcessBuilder.Redirect.PIPE)
            .redirectError(ProcessBuilder.Redirect.PIPE)
            .start().also { it.waitFor(timeoutAmount, timeoutUnit) }
            .inputStream.bufferedReader().readText()
    }.onFailure { it.printStackTrace() }.getOrNull()

    tasks.withType<Test> {
        // alias docker-machine="podman machine"
        val podmanSocket = "/run/user/${"id -u".runCommand()?.trimEnd()}/podman/podman.sock"
        if (file(podmanSocket).exists()) {
            environment("TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE", podmanSocket)
            environment("DOCKER_HOST", "unix://${podmanSocket}")
            environment("TESTCONTAINERS_RYUK_DISABLED", "true")
        }
    }

    tasks.compileKotlin {
        kotlinOptions {
            jvmTarget = "17"
            freeCompilerArgs += "-Xjsr305=strict"
        }
    }
}



