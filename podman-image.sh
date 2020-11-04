#!/bin/bash
./gradlew build
podman build -t 'localchat2' -f Dockerfile
