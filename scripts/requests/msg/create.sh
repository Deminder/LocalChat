#!/bin/bash
CID=$1
if [ -z "$CID" ]; then
    echo "CID not specified!"
    exit 1
fi
TEXT=${2:-someText}
./ccurl.sh /api/conversations/"$CID"/messages -X PUT -H "Content-Type: application/json" \
    --data '{"text":"'"$TEXT"'"}' \
