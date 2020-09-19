#!/bin/bash
./ccurl.sh -X POST \
	-H "Content-Type: application/json" \
	--data "{\"username\":\"$1\",\"password\":\"$2\"}" \
	http://localhost:9432/api/user/register/
#-F "username=$1" -F "password=$2" \
#--data '{"username":"a","password":"b"}' \
