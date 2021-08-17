#LoacalChat2
Simple client-server chatting web app with Spring Boot and Angular. Intended as a learning aid and personal reference. **Unsafe for production**.

## Stack

- Kotlin backend: Spring Boot 2.3.3
  - PostgreSQL (with Flyway migrations)
  - Jasypt credentials
  - Swagger codegen (openapi)
  - SSL certificate
  - WebSockets
  - Unit tests (SpringBoot, MockK)
- Typescript frontend: Angular 10
  - Material Design
  - NgRx store ( + router-store)
  - Audio worklets + WebSockets (for basic voice transmission)
  - Karma tests
- Deployment: Podman (Docker)
  - Build with _gradle_ and run on _openjdk:14-jdk-alpine_ image
  - Dev and prod profiles for _docker-compose.yaml_ (via _.env_ files)

## Features

- User authentication
  - Register with user name and password
  - Login/logout and view/delete active login cookies
- Conversation
  - Users may create a conversation and add/remove members
  - Edit member color or permissions: administrate, moderate, read, voice, write
  - Send or edit messages
  - Receive messages by Server-sent events (SSE)
    - Optional desktop notification and notification sound
  - Fetch older messages while scrolling
  - Search for text (or regex) in message history
  - Basic voice transmission via WebSockets (not using WebRTC)
