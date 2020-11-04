#!/bin/bash
STORENAME=server-prod.p12
ALIAS=localchat
read -sp "storepass:" pass 
echo
export STOREPASS=$pass
keytool -importcert -v \
	-alias "$ALIAS" \
	-keystore "$STORENAME" \
	-storepass:env STOREPASS \
	-file "$1" && echo "Imported certificate $STORENAME:$ALIAS from $1 ( move to server resource classpath:/ )"

