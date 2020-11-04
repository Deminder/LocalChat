#!/bin/bash
cd "$(dirname "${BASH_SOURCE[0]}")"
export JASYPT=jasypt-1.9.3
if [ ! -d "$JASYPT" ]; then
	./jasypt-init.sh >/dev/null 2>/dev/null 
fi

# using jaspypt-1.9.3-dist bin
cd "$JASYPT/bin"
./encrypt.sh \
	input="$1" \
	password="$2" \
	algorithm="PBEWITHHMACSHA256ANDAES_128" \
	ivGeneratorClassName="org.jasypt.iv.RandomIvGenerator" \
	verbose=false \
