FROM openjdk:17-jdk-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
EXPOSE 9432
ARG SERVER_VERSION=0.1
COPY server/build/libs/server-$SERVER_VERSION.jar home/spring/localchat.jar
ENTRYPOINT [ "java", "-jar", "/home/spring/localchat.jar" ]
