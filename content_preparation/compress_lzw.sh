#!/bin/bash

function usage {
    echo usage: $(basename $0) SOURCE TARGET
    exit 1
}

if [ ! -f "$1" ]; then
    echo Invalid SOURCE
    usage; 
fi

SOURCE=$1
TARGET=$2

echo source: $SOURCE
#echo target: $TARGET
convert "$SOURCE" -compress LZW "$TARGET"

