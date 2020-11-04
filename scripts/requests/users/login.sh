#!/bin/bash
USERNAME=${1:-admin}
PASSWORD=${2:-12345678}
if [[ "$2" = "" && "$USERNAME" = "admin" ]]; then
	PASSWORD="admin"
fi

./ccurl.sh /api/user/login -X POST -j \
	-H "Content-Type: application/json" \
	--data '{"username":"'$USERNAME'", "password":"'$PASSWORD'"}'

