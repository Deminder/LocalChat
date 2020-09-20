#!/bin/bash
CID=$1
if [ -z "$CID" ]; then
    echo "CID not specified!"
    exit 1
fi
TEXT=${2:-someText}
./ccurl.sh -H "Content-Type: application/json" \
    --data '{"text":"'"$TEXT"'"}' \
    http://localhost:9432/api/conversations/"$CID"/messages/upsert
