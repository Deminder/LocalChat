#!/bin/bash
HOST="localhost:9432"
URL_PATH="$1"
shift
if [[ "$1" == "https" ]];then
    URL="https://$HOST$URL_PATH"
else
    URL="http://$HOST$URL_PATH"
fi
curl --insecure -b cookies.txt -c cookies.txt -v "$@" "$URL"
