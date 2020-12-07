#!/bin/bash
if [ "$1" = "prod" ];then
	cp server-prod.env server.env
else
	cp server-dev.env server.env
	DEV="-dev"
fi

PROJECT_VERSION=$2
if [ -z "$PROJECT_VERSION" ]; then
  PROJECT_VERSION=$(gradle printVersion --console=plain -q | grep "^version:" | awk '{print $2}')
fi

podman build \
  -t "localchat2$DEV" \
  --build-arg SERVER_VERSION="$PROJECT_VERSION" \
  -f Dockerfile
