#!/bin/bash

function usage {
    echo usage: $(basename $0) RESIZE SOURCE TARGET
    exit 1
}

if [ ! -f "$2" ]; then
    echo Invalid SOURCE
    usage; 
fi

RESIZE=$1
SOURCE=$2
TARGET=$3

TARGET=$(dirname "$TARGET")/$(basename "$TARGET" .tif).jpg

#echo resize: $RESIZE
echo source: $SOURCE
#echo target: $TARGET
convert "$SOURCE" -resize $RESIZE "$TARGET"

