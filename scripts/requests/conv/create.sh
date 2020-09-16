#!/bin/bash

./ccurl.sh -X POST \
	-F "conversationName=$1" -F "memberNames=${2:-user2}" \
	http://localhost:9432/api/conversations
#-H "Content-Type: application/json" \
#--data "{\"conversationName\":\"$1\",\"memberNames\":[\"user2\"]}" \
