#!/bin/bash
PASSWORD=${2:-12345678}
./ccurl.sh -X POST \
	-H "Content-Type: application/json" \
	--data '{"username":"'$1'","password":"'$PASSWORD'"}' \
	http://localhost:9432/api/user/register/
#-F "username=$1" -F "password=$2" \
#--data '{"username":"a","password":"b"}' \
