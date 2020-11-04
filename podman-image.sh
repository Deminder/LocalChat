#!/bin/bash
if [ "$1" = "prod" ];then
	cp server-prod.env server.env
else
	cp server-dev.env server.env
fi
podman build -t 'localchat2' -f Dockerfile
