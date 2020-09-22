#!/bin/bash
wget -O localchat-swagger.json http://localhost:9432/v2/api-docs
# https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.0.0-beta2/openapi-generator-cli-5.0.0-beta2.jar
rm openapi/model/*.ts
java -jar ./openapi-generator-cli.jar generate \
    -i localchat-swagger.json \
    -g typescript-angular \
    -o ./openapi

OPENAPI_DIR=../../server/src/webclient/src/app/openapi/model/
if [ ! -d $OPENAPI_DIR ]; then
    mkdir -p $OPENAPI_DIR
fi

rm ../../server/src/webclient/src/app/openapi/model/*.ts
cp openapi/model/*.ts ../../server/src/webclient/src/app/openapi/model/
