#!/bin/bash

./ccurl.sh -X POST -j \
	-F "username=admin" -F "password=admin" \
	http://localhost:9432/login
