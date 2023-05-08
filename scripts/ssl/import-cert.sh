#!/bin/bash
CERT_FILE=$1
STORENAME=${2:-server-prod}
ALIAS=localchat
read -sp "storepass:" pass 
echo
export STOREPASS=$pass
keytool -importcert -v \
	-alias "$ALIAS" \
	-keystore "$STORENAME".p12 \
	-storepass:env STOREPASS \
	-file "$CERT_FILE" && echo "Imported certificate $STORENAME:$ALIAS from $CERT_FILE ( move to server resource classpath:/ )"

