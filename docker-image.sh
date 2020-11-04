#!/bin/bash
./gradlew build
docker build -t 'localchat2'
