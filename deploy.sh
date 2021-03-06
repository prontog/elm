#!/bin/bash
SCRIPT_NAME=$(basename $0)

# Function to output usage information.
usage() {
    cat << EOF
Usage: $SCRIPT_NAME [OPTION]
Deploys the web site.

Options:
  -a
        deploy everything.
  -h
        display this help and exit

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

# Exit on error.
set -o errexit

# Generate the static site.
echo Cleaning out directory...
docpad clean
echo Generating static site...
docpad generate

# Execute Grunt file.
grunt

cd out

if [ "$DEPLOY" != "all" ]; then
    # Delete images
    rm -rf images
    # Delete documents
    rm -rf documents
fi

FILENAME=elm_$(date +%Y%m%d).zip
# Compress everything into a zipped archive.
zip -r $FILENAME *

curl --silent --ftp-create-dirs -T $FILENAME -u $FTP_USER:$FTP_PASSWORD $FTP_URL
