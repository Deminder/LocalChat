FROM openjdk:14-jdk-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
EXPOSE 9432
# keystore password for classpath:/server-prod.jks OR classpath:/server-dev.jks in jar
# (see application-dev.yaml / application-prod.yaml)
ENV PROFILE=dev STOREPASS=changeme
COPY server/build/libs/server-0.1-SNAPSHOT.jar home/spring/localchat.jar
ENTRYPOINT ["java", "-jar", "/home/spring/localchat.jar", "-Dspring.profiles.active=${PROFILE}", "-Djasypt.encryptor.password=${STOREPASS}"]
