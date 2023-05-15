FROM openjdk:17-jdk-alpine
RUN adduser -S localchat
USER localchat
EXPOSE 9432
COPY ./server/build/libs/server-1.1.jar /home/localchat/localchat.jar
ENTRYPOINT [ "java", "-jar", "/home/localchat/localchat.jar" ]
