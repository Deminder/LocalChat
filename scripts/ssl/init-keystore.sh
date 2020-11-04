#!/bin/bash
# "CN=hostname,OU=?,O=?,L=?,ST=?,C=?"
DNAME=$1 
STORENAME=server-prod.p12
ALIAS=localchat
read -sp "storepass:" pass 
echo
export STOREPASS=$pass
if [ ! -z "$DNAME" ]; then
	keytool -genkeypair -v \
		-alias "$ALIAS" \
		-keyalg rsa \
		-keysize 4096 \
		-validity 365 \
		-storetype pkcs12 \
		-dname "$DNAME" \
		-keystore "$STORENAME" \
		-storepass:env STOREPASS && echo "Gen keypair $STORENAME:$ALIAS ( self signed )"
fi
if [ ! -f "$STORENAME" ]; then
	echo "Expected dname argument to create new keystore!"
	exit 1
fi
keytool -certreq \
	-alias "$ALIAS" \
	-keystore "$STORENAME" \
	-storepass:env STOREPASS \
	-file server-prod.csr && echo "Created CSR for $STORENAME:$ALIAS ( pass to CA )"


