#!/bin/bash

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
find . -type f -name '*.tif' -exec ../compress_lzw.sh "{}" "../$OUTDIR/{}"  \;
cd - > /dev/null

# To convert to heigth-800 PNGs
INDIR=orig
OUTDIR=800
echo Converting to heigth-800 PNGs [indir: $INDIR, outdir: $OUTDIR]
copy_dir_tree $INDIR $OUTDIR 
cd $INDIR
find . -type f -name '*.tif' -exec ../to_png.sh x800 "{}" "../$OUTDIR/{}"  \;
cd - > /dev/null

# To convert to heigth-200 PNGs (Thumbs)
INDIR=orig
OUTDIR=200
echo Converting to heigth-200 PNGs [indir: $INDIR, outdir: $OUTDIR]
copy_dir_tree $INDIR $OUTDIR 
cd $INDIR
find . -type f -name '*.tif' -exec ../to_png.sh x200 "{}" "../$OUTDIR/{}"  \;
cd - > /dev/null

