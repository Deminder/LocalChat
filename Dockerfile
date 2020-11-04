FROM openjdk:14-jdk-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
EXPOSE 9432
COPY server/build/libs/server-0.1-SNAPSHOT.jar home/spring/localchat.jar
ENTRYPOINT [ "java", "-jar", "/home/spring/localchat.jar" ]
