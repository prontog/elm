#!/bin/bash

SCRIPT_NAME=$(basename $0)

# Function to output usage information.
usage() {
    cat << EOF
Usage: $SCRIPT_NAME [-h|--help] COMMAND [PATTERN]... FILE...
Find or edit single line docpad metadata (YAML).

Commands:

  list  Lists the metadata that match a BRE pattern. Leave
        blank to list all metadata.
  edit  Perform a sed command on the metadata. 
  
Patterns:

  A basic regular expression (BRE) without the escaping.
  
EOF
    exit 1
}

# Function to ouput an error message.
error() {
    echo $SCRIPT_NAME: $1. See "$SCRIPT_NAME --help".
    exit 1
}

# Validate arguments.
# If no parameter is specified
if [ $# == 0 ]; then
    usage
fi

CMD=$1
shift 1

case $CMD in
    list)   SED_OPT='-n'
            if [ "$1" == "" ]; then PATTERN=p
            else PATTERN=/$1/p; fi
        ;;
    edit)   SED_OPT='-i.bak'
            if [ "$1" == "" ]; then error "Missing pattern"; fi
            PATTERN=$1
        ;;
    --help|-he) usage 
        ;;
    *)  error "$CMD is not a valid command"
        ;;
esac

SED_SCRIPT="/\-\-\-/,/\-\-\-/{ ${PATTERN} }"

shift 1

FILE_LIST=$*
if [ "$*" == "" ]; then
    FILE_LIST="."
fi

#set -o posix

for FILE in $FILE_LIST
do
    if [ -f $FILE ]; then
        sed $SED_OPT "$SED_SCRIPT" $FILE
    elif [ -d $FILE ]; then
        find $FILE -type f -exec sed $SED_OPT "$SED_SCRIPT" {} \;
    fi    
done
