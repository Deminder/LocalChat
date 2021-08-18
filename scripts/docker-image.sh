#!/bin/bash

# cd to the repo root
cd "$( cd "$( dirname "$0" )" && pwd )/.."

if [ "$1" = "prod" ];then
	cp server-prod.env server.env
else
	cp server-dev.env server.env
	DEV="-dev"
fi

PROJECT_VERSION=$2
if [ -z "$PROJECT_VERSION" ]; then
  PROJECT_VERSION=$(./gradlew printVersion --console=plain -q | grep "^version:" | awk '{print $2}')
fi

docker build \
  -t "localchat2$DEV:latest" \
  -t "localchat2$DEV:$PROJECT_VERSION" \
  --build-arg SERVER_VERSION="$PROJECT_VERSION" \
  .
