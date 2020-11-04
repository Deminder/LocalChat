#!/bin/bash
PASSWORD=${2:-12345678}
./ccurl.sh /api/user/register/ -X POST \
	-H "Content-Type: application/json" \
	--data '{"username":"'$1'","password":"'$PASSWORD'"}' \
#-F "username=$1" -F "password=$2" \
#--data '{"username":"a","password":"b"}' \
