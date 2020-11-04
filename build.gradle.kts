plugins {
    idea
    id("org.springframework.boot") version "2.3.3.RELEASE"
    id("io.spring.dependency-management") version "1.0.10.RELEASE"
    kotlin("jvm") version "1.4.0"
    kotlin("plugin.spring") version "1.4.0"
    id("com.palantir.docker") version "0.25.0"
}

docker {
    name = "${project.name}:${project.version}"
}

idea {
    module {
        isDownloadSources = true
        isDownloadJavadoc = true
    }
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}

extra["springCloudVersion"] = "Hoxton.SR8"
dependencyManagement {
    imports {
        mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
    }
}

tasks.bootJar {
    enabled = false
}

tasks.jar {
    enabled = false
}



allprojects {
    group = "de.dem.localchat"
    version = "0.1-SNAPSHOT"

    repositories {
        mavenCentral()
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
        implementation(kotlin("reflect"))
        implementation(kotlin("stdlib-jdk8"))
        implementation("org.springframework.cloud:spring-cloud-starter-sleuth:2.2.5.RELEASE")
        implementation("javax.validation:validation-api:2.0.1.Final")
        implementation("com.github.ulisesbocchio:jasypt-spring-boot-starter:3.0.3")
        implementation("org.springframework:spring-context-support:5.2.6.RELEASE")
        developmentOnly("org.springframework.boot:spring-boot-devtools")
        runtimeOnly("org.postgresql:postgresql")
        testImplementation("com.ninja-squad:springmockk:2.0.2")
        testImplementation("org.springframework.boot:spring-boot-starter-test") {
            exclude(group = "org.junit.vintage", module = "junit-vintage-engine")
        }
        testImplementation("org.junit.jupiter:junit-jupiter-engine:5.6.2")
        testImplementation("org.springframework.security:spring-security-test")
        testImplementation("io.zonky.test:embedded-database-spring-test:1.5.5")
    }

    tasks.test {
        useJUnitPlatform()
    }
    tasks.compileKotlin {
        kotlinOptions {
            freeCompilerArgs = listOf("-Xjsr305=strict")
            jvmTarget = "11"
        }
    }
}



