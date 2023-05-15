#!/bin/bash

set -e
CONF=$1

PKCS_FILE=server/src/main/resources/server-$CONF.p12
echo "Checking key store \"$PKCS_FILE\" exists..."

function readstorepass {
	read -sp "$1" pass 
	echo
	export STOREPASS=$pass
}

ALIAS=localchat
if [ ! -f "$PKCS_FILE" ]
then
  echo "Create new keystore $PKCS_FILE:"
	readstorepass "New keystore password:"
	CN=${CN:-localhost}
	C_EXT="san=${SAN:-dns:${CN}}"
	keytool -genkeypair -v \
		-alias "$ALIAS" \
		-keyalg EC \
		-validity 365 \
		-storetype pkcs12 \
		-dname "CN=${CN},OU=${OU:-$ALIAS},O=${O:-$ALIAS},L=${L:-?},ST=${ST:-?},C=${C:-DE}" \
		-ext "$C_EXT" \
		-keystore $PKCS_FILE \
		-storepass:env STOREPASS
	keytool -certreq \
		-alias "$ALIAS" \
		-keystore $PKCS_FILE \
		-storepass:env STOREPASS \
		-ext "$C_EXT" \
		-file "$PKCS_FILE.csr"
	echo "Generated CSR: $PKCS_FILE.csr"
	echo "(This script tries to import a (signed) certificate from \"$PKCS_FILE.cert\")"
fi

if [ -f "$PKCS_FILE".cert ]
then
	echo "Importing certificate: \"$PKCS_FILE.cert\" into \"$PKCS_FILE\""
	readstorepass "Keystore password:"
	keytool -importcert -v \
		-alias "$ALIAS" \
		-keystore "$PKCS_FILE" \
		-storepass:env STOREPASS \
		-file "$PKCS_FILE.cert"
	mv "$PKCS_FILE".cert{,.imported}
fi

echo "DONE"
