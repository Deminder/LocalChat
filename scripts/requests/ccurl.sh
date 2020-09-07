#!/bin/bash
curl -b cookies.txt -c cookies.txt -v "$@"
