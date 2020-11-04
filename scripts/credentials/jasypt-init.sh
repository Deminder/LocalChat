#!/bin/bash
if [ -z "$JASYPT" ]; then
	echo "JASYPT variable required!"
	exit 1
fi
wget https://github.com/jasypt/jasypt/releases/download/$JASYPT/$JASYPT-dist.zip
unzip $JASYPT-dist.zip
rm $JASYPT-dist.zip
chmod +x "$JASYPT"/bin/*

# java.lang.ExceptionInInitializerError
# https://github.com/jasypt/jasypt/issues/44
# rm "$JASYPT"/lib/icu4j-3.4.4.jar
