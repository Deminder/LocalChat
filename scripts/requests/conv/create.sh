#!/bin/bash
MEMBERS=${2:-[]}
./ccurl.sh -X POST \
	-H "Content-Type: application/json" \
	--data "{\"conversationName\":\"$1\",\"memberNames\":$MEMBERS}" \
	http://localhost:9432/api/conversations
#-F "conversationName=$1" -F "memberNames=${2:-user2}" \
