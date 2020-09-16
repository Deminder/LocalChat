#!/bin/bash
./ccurl.sh -X POST \
	-F "username=$1" -F "password=$2" \
	http://localhost:9432/register-user/
# -H "Content-Type: application/json" \
#--data "{\"username\":\"$1\",\"password\":\"$2\"}" \
#--data '{"username":"a","password":"b"}' \
