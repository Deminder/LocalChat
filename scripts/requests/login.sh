#!/bin/bash

./ccurl.sh -j \
	-F "username=admin" -F "password=admin" \
	http://localhost:9432/login
