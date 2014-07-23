#!/bin/bash
SCRIPT_NAME=$(basename $0)

# Function to output usage information.
usage() {
    cat << EOF
Usage: $SCRIPT_NAME [OPTION] DOCPAD_ENV
Deploys the web site using the settings of a docpad environment.

Options:
  -a
        deploy everything.
  -h
        display this help and exit

docpad Environment

        the enviroment to be used from the docpad configuration file.

Note:

  By default the images and documents directories are not deployed. 
  These directories rarely change and take most of the space.
  
EOF
    exit 1
}

# Function to ouput an error message.
error() {
    echo $SCRIPT_NAME: $1. See "$SCRIPT_NAME -h".
    exit 1
}

# Validate arguments.
# If no parameter is specified
if [ $# == 0 ]; then
    usage
fi

# Parse options.
while getopts ha currOption
do
	case $currOption in		
		h) usage
			;;
		a) DEPLOY=all
			;;		
        *) error "$currOption is not a valid option"
            ;;
	esac
done

# First non-option argument should be the docpad environment.
DOCPAD_ENV=${@:$OPTIND}

# Validate arguments.
# If no parameter is specified
if [ "$DOCPAD_ENV" == "" ]; then
    usage
fi

# Exit on error.
set -o errexit

# Generate the static site.
echo Cleaning out directory...
docpad --env DOCPAD_ENV clean
echo Generating static site...
docpad --env DOCPAD_ENV generate

# Execute Grunt file.
grunt

cd out

if [ "$DEPLOY" != "all" ]; then
    # Delete images
    rm -rf images
    # Delete documents
    rm -rf documents
fi

FILENAME=elm.tar.gz
# Compress everything into a zipped archive.
tar -czf $FILENAME *

curl --ftp-create-dirs -T $FILENAME -u $FTP_USER:$FTP_PASSWORD ftp://$FTP_URL
 