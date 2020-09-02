#!/bin/bash
#curl --header "Content-Type: application/json" \
	#--request POST \
	#--data '{"username":"testuser","password":"testuser"}' \
	#-v \
	#http://localhost:9432/login

curl -X POST \
	-F "username=admin" -F "password=admin" \
	-v \
	http://localhost:9432/login
