#!/bin/bash
NAME=${1:-conv123}
MEMBERS=${2:-'[]'}

function grepCIDByName {
    grep -oP '"id":\d+,"name":"'"$1"'"' | grep -oP '\d+' | head -n 1
}

CID=$(./conv/create.sh "$NAME" "$MEMBERS" 2> /dev/null | grepCIDByName "$NAME")
if [ -z "$CID" ]; then
    echo "CID not found!"
    exit 1
fi

echo "$CID"

