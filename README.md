# Local Chat
Simple local network client-server chatting web app with Spring Boot and Angular. Intended as a learning aid and personal reference. **Unsafe for production**.

## Stack

- Kotlin backend: Spring Boot 2.3.3
  - PostgreSQL (with Flyway migrations)
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
  - Build with _gradle_ and run on _openjdk:17-jdk-alpine_ image
  - Dev and prod profiles for _docker-compose.yaml_ (via _.env_ files)

## Features

- User authentication
  - Register with username and password
  - Login/logout and view/delete active login cookies
- Conversation
  - Users may create a conversation and add/remove members
  - Edit member color or permissions: administrate, moderate, read, voice, write
  - Send or edit messages
  - Receive messages by Server-sent events (SSE)
    - Optional desktop notification
  - Fetch older messages while scrolling
  - Search for text (or regex) in message history
  - Basic voice transmission via WebSockets (not using WebRTC)

## Development
Generate a key store for the `dev` profile:
```shell
./gen-keystore.sh dev
```
Run the backend api at `localhost:9432` without assembling the webclient:
```shell
docker-compose up -d db pgadmin
POSTGRES_HOST=localhost ./gradlew server:bootRun -x :server:webclient:assembleFrontend
```
Then, run the webclient in `development` configuration at `localhost:4200`:
```shell
cd server/src/webclient && yarn install
yarn start
```

## Deployment
Generate a key store for the `prod` profile:
```shell
./gen-keystore.sh prod
```
Then, configure `docker-compose.prod.yaml` and startup an instance:
```shell
./gradlew build
docker-compose up -f docker-compose.yaml -f docker-compose.prod.yaml -d
```
Note that by default `server.ssl.enabled: false` and some existing reverse proxy configuration is expected for SSL.
