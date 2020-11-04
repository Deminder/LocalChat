#!/bin/bash
read -sp "storepass:" STOREPASS
echo
read -sp "admin password:" ADMINPASS
echo
DIR=$(dirname "${BASH_SCRIPT[0]}")
ENC_STOREPASS=$("$DIR"/../credentials/sec_encrypt.sh "$STOREPASS" "$STOREPASS")
ENC_ADMINPASS=$("$DIR"/../credentials/sec_encrypt.sh "$ADMINPASS" "$STOREPASS")
STORENAME=server-prod.p12
ALIAS=localchat
STORETYPE=pkcs12
YAMLFILE=application-prod.yaml

cat > "$YAMLFILE" << EOF
# generated by $(basename "${BASH_SOURCE[0]}")
devtools:
  add-properties: false

encrypt:
  key-store:
    location: classpath:/${STORENAME}
    password: 'ENC(${ENC_STOREPASS})'
    alias: ${ALIAS}

server:
  ssl:
    key-store: classpath:${STORENAME}
    key-store-password: 'ENC(${ENC_STOREPASS})'
    key-store-type: ${STORETYPE}
    key-alias: ${ALIAS}
    key-password: 'ENC(${ENC_STOREPASS})'

manage:
  admin:
    password: 'ENC(${ENC_ADMINPASS})'
EOF
echo "Generated $YAMLFILE (move to server resources classpath:/) "
