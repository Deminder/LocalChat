#!/bin/bash
# using jaspypt-1.9.3-dist bin
cd $JASYPT_HOME/bin
./decrypt.sh \
	input="$1" \
	password="$2" \
	algorithm="PBEWITHHMACSHA256ANDAES_128" \
	ivGeneratorClassName="org.jasypt.iv.RandomIvGenerator" \
	verbose=false \
