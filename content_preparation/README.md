## Some useful scripts and commands

### Scripts

#### [meta.sh](meta.sh)
Find or edit single line docpad metadata (YAML).

#### [text_preparation.md](text_preparation.md)
Some of the steps taken to extract the content used for the website from various PDF and DOC/DOCX files.

### Image processing scripts.

#### [prepare_images.sh](prepare_images.sh)
Create resized (800, 200) versions of TIFF images into PNG. Given a directory, it copies the directory structure for each resolution and then create a resized version of each containg TIFF image into the new directory. The final output should be two (one for each resolution) directories containing PNG files with the same name.

#### [compress_lzw.sh](compress_lzw.sh)
Compresses a TIFF image using LZW compression. Uses [ImageMagick](http://www.imagemagick.org/).

#### [to_png.sh](to_png.sh)
Resizes an image and converts it to PNG format. Uses [ImageMagick](http://www.imagemagick.org/).

### Commands

To replace specific patterns from all markdown (docpad) files:
    cd src/documents
    find -type f -regex '.*\.md[\.]?.*' -exec sed -i .bak 's/PATTERN/REPLACEMENT/' {} \;
** Note: The original files are renamed with the .bak extension. **

Then To remove the .bak files:
    find -type f -name '*.bak' -delete

To find pages with the same title: 
    grep -rf <(grep -rh 'title:' | sort | uniq -d)

To convert all PNG images to JPEG:
    find -type f -name '*.png' -exec bash -c 'convert $1 ${1/.png/.jpg}' _ {} \;

To replace occurences like 2nd to:
    2<sup>nd</sup>
./meta.sh --all edit 's/\([[:digit:]][[:digit:]]*\)\([[:alpha:]][[:alpha:]]*\)/\1<sup>\2<\/sup>/g' src/documents

To make all src and href values absolute for opening with a browser locally:
./meta.sh --all edit 's@="/@="file:///ABS_PATH/@g' out/

where ABS_PATH is the full path of the root directory.
