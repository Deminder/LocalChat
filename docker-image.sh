#!/bin/bash
./gradlew build || exit 1

if [ "$1" = "prod" ];then
	cp server-prod.env server.env
else
	cp server-dev.env server.env
fi
docker build -t 'localchat2' .
