#!/bin/bash
# "CN=hostname,OU=?,O=?,L=?,ST=?,C=?"

C_EXT="san=${SAN:-dns:${CN}}"
STORENAME=${1:-server-prod}
ALIAS=localchat
read -sp "storepass:" pass 
echo
export STOREPASS=$pass
if [ ! -f "$STORENAME".p12 ]; then
	for dname in CN OU O L ST C
	do
		[ -z "${!dname}" ] && MISSING_DNAME="$MISSING_DNAME$dname=? "
	done
	if [ ! -z "${MISSING_DNAME}" ]
	then
			echo "Missing fields: $MISSING_DNAME"
			exit 1
	fi
	keytool -genkeypair -v \
		-alias "$ALIAS" \
		-keyalg rsa \
		-keysize 4096 \
		-validity 365 \
		-storetype pkcs12 \
		-dname "CN=${CN},OU=${OU},O=${O},L=${L},ST=${ST},C=${C}" \
		-ext "$C_EXT" \
		-keystore "$STORENAME".p12 \
		-storepass:env STOREPASS && echo "Gen keypair $STORENAME:$ALIAS ( self signed )"
fi
if [ ! -f "$STORENAME".p12 ]; then
	echo "Expected dname argument to create new keystore!"
	exit 1
fi
if [ -z "${CN}" ]
then
		echo "Missing field: CN"
		exit 1
fi
keytool -certreq \
	-alias "$ALIAS" \
	-keystore "$STORENAME".p12 \
	-storepass:env STOREPASS \
	-ext "$C_EXT" \
	-file "$STORENAME".csr && echo "Created CSR for $STORENAME:$ALIAS ( pass to CA )"


