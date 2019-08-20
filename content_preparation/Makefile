SHELL := $(shell which bash)
JPG_HEIGTH = x1024
THUMB_HEIGTH = x400

ORIG_TIF_FILES = $(wildcard images/orig/*/*.tif)
ORIG_JPG_FILES = $(wildcard images/orig/*/*.jpg)
ORIG_PDF_FILES = $(wildcard images/orig/*/*.pdf)

TARGET_JPG_FILES = $(patsubst images/orig/%.tif, images/jpg/%.jpg, ${ORIG_TIF_FILES}) $(patsubst images/orig/%.jpg, images/jpg/%.jpg, ${ORIG_JPG_FILES}) $(patsubst images/orig/%.pdf, images/jpg/%.jpg, ${ORIG_PDF_FILES})
TARGET_THUMB_FILES = $(patsubst images/orig/%.tif, images/jpg/%-th.jpg, ${ORIG_TIF_FILES}) $(patsubst images/orig/%.jpg, images/jpg/%-th.jpg, ${ORIG_JPG_FILES}) $(patsubst images/orig/%.pdf, images/jpg/%-th.jpg, ${ORIG_PDF_FILES})


IMAGE_DIRS = . epetiaka-afierwmata epetirides erga_lefkadiwn_sygrafewn laografika lefkwmata meletes other praktika_symposiwn praktika_synedriwn
TARGET_DIRS = $(addprefix images/jpg/, ${IMAGE_DIRS})

# Template target for JPG image from TIFF image.
define TIF_to_JPG_template =
images/jpg/$(1)/%.jpg: images/orig/$(1)/%.tif
	convert $$< -strip -quality 85 -resize ${JPG_HEIGTH} $$@
endef
# Template target for JPG image from JPEG image.
define JPG_to_JPG_template =
images/jpg/$(1)/%.jpg: images/orig/$(1)/%.jpg
	convert $$< -strip -quality 85 -resize ${JPG_HEIGTH} $$@
endef

# Template target for thumbnails from TIFF image.
define TIF_to_THUMB_template =
images/jpg/$(1)/%-th.jpg: images/orig/$(1)/%.tif
	convert $$< -strip -quality 85 -resize ${THUMB_HEIGTH} $$@
endef
# Template target for thumbnails from JPEG image.
define JPG_to_THUMB_template =
images/jpg/$(1)/%-th.jpg: images/orig/$(1)/%.jpg
	convert $$< -strip -quality 85 -resize ${THUMB_HEIGTH} $$@
endef

# Template target for directories
define create_dir_template =
$(1): $(2)
	@if ! [[ -d $(1) ]]; then \
		echo mkdir -p $(1); \
		mkdir -p $(1); \
	fi
endef

.PHONY: all
all: ${TARGET_DIRS} ${TARGET_JPG_FILES} ${TARGET_THUMB_FILES}

# Image targets. Create dynamically using the eval function.
# see https://www.gnu.org/software/make/manual/html_node/Eval-Function.html#Eval-Function
$(foreach d, ${IMAGE_DIRS}, $(eval $(call create_dir_template,images/jpg/$(d),images/orig/$(d))))
$(foreach d, ${IMAGE_DIRS}, $(eval $(call TIF_to_JPG_template,$(d))))
$(foreach d, ${IMAGE_DIRS}, $(eval $(call JPG_to_JPG_template,$(d))))
$(foreach d, ${IMAGE_DIRS}, $(eval $(call TIF_to_THUMB_template,$(d))))
$(foreach d, ${IMAGE_DIRS}, $(eval $(call JPG_to_THUMB_template,$(d))))

# pdf
# convert -density 300 -trim %? -quality 85 -resize ${HEIGTH} $@
# convert "$SOURCE" -compress LZW "$TARGET"

clean:
	rm -rf images/jpg
