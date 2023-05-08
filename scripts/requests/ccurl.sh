#!/bin/bash
if [ -z "$LC_BASE_URL" ]; then
	LC_BASE_URL="http://localhost:9432"
fi
URL_PATH="$1"
shift
curl --insecure -b cookies.txt -c cookies.txt -v "$@" "${LC_BASE_URL}${URL_PATH}"
echo
