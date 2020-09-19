#!/bin/bash
USERNAME=${1:-admin}
PASSWORD=${2:-12345678}
if [[ "$USERNAME" = "admin" ]]; then
	PASSWORD=admin
fi

./ccurl.sh -X POST -j \
	-F "username=$USERNAME" -F "password=$PASSWORD" \
	http://localhost:9432/api/user/login
#	-H "Content-Type: application/json" \

