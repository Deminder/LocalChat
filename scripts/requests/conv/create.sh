#!/bin/bash
MEMBERS=${2:-[]}
./ccurl.sh /api/conversations -X POST \
	-H "Content-Type: application/json" \
	--data "{\"name\":\"$1\",\"memberNames\":$MEMBERS}" \
#-F "conversationName=$1" -F "memberNames=${2:-user2}" \
