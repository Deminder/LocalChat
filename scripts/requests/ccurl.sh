#!/bin/bash
curl --insecure -b cookies.txt -c cookies.txt -v "$@"
