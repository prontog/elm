## Some useful scripts and commands

### Scripts

#### [meta.sh](meta.sh)
Find or edit single line docpad metadata (YAML).

#### [text_preparation.md](text_preparation.md)
Some of the steps taken to extract the content used for the website from various PDF and DOC/DOCX files.

### Image processing scripts.

Add a symbolic link to the directory with the images.
```bash
ln -s IMAGE_DIR content_preparation/images
```
Then use the [Makefile](Makefile) to prepare web-friendly versions as well as thumbnails.

```bash
cd content_preparation
make
```

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
