#!/bin/bash
if [ "$1" = "prod" ];then
	cp server-prod.env server.env
else
	cp server-dev.env server.env
	DEV="-dev"
fi
docker build -t "localchat2$DEV" .
