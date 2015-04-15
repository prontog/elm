#!/bin/bash

SCRIPT_DIR=$(dirname $0)
# Exit on error.
set -o errexit

# Copies just the directory tree (no files)
function copy_dir_tree {
    if [ ! -d "$1" ]; then 
	echo copy_dir_tree: invalid source [$1]; 
	exit 1; 
    fi
 
    SOURCE=$(readlink -f "$1")
    TARGET=$(readlink -f "$2")
    mkdir "$TARGET"
    cd "$SOURCE"
    find . -type d -exec mkdir "$TARGET/{}" \;
    cd -
}

# To compress all TIFFs with LZW
INDIR=orig
OUTDIR=lzw
echo Compressing all TIFFs with LZW [indir: $INDIR, outdir: $OUTDIR]
copy_dir_tree $INDIR $OUTDIR
cd $INDIR
find . -type f -name '*.tif' -exec $SCRIPT_DIR/compress_lzw.sh "{}" "../$OUTDIR/{}"  \;
cd - > /dev/null

# Convert images to JPGs
HEIGTH=1024
INDIR=orig
OUTDIR=$HEIGTH
echo Converting to heigth-${HEIGTH} JPGs [indir: $INDIR, outdir: $OUTDIR]
copy_dir_tree $INDIR $OUTDIR 
cd $INDIR
find . -type f -name '*.tif' -exec $SCRIPT_DIR/to_jpg.sh x${HEIGTH} "{}" "../$OUTDIR/{}"  \;
cd - > /dev/null

# Create thumbs
HEIGTH=400
INDIR=orig
OUTDIR=$HEIGTH
echo Converting to heigth-${HEIGTH} JPGs [indir: $INDIR, outdir: $OUTDIR]
copy_dir_tree $INDIR $OUTDIR 
cd $INDIR
find . -type f -name '*.tif' -exec $SCRIPT_DIR/to_jpg.sh x${HEIGTH} "{}" "../$OUTDIR/{}"  \;
#ToDo: Add -th before the extension.
cd - > /dev/null

