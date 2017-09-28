JPG_HEIGTH = x1024
THUMB_HEIGTH = x400

ORIG_TIF_FILES = $(wildcard images/orig/*/*.tif)
ORIG_PDF_FILES = $(wildcard images/orig/*/*.pdf)
JPG_FILES = $(patsubst images/orig/%.tif, images/jpg/%.jpg, ${ORIG_TIF_FILES}) $(patsubst images/orig/%.pdf, images/jpg/%.jpg, ${ORIG_PDF_FILES})
THUMB_FILES = $(patsubst images/orig/%.tif, images/jpg/%-th.jpg, ${ORIG_TIF_FILES}) $(patsubst images/orig/%.pdf, images/jpg/%-th.jpg, ${ORIG_PDF_FILES})

IMAGE_DIRS = . epetiaka-afierwmata epetirides erga_lefkadiwn_sygrafewn laografika lefkwmata meletes other praktika_symposiwn praktika_synedriwn

# Template target for JPG image from TIFF image.
define JPG_template =
images/jpg/$(1)/%.jpg: images/orig/$(1)/%.tif
	convert $$< -strip -quality 85 -resize ${JPG_HEIGTH} $$@
endef
# Template target for thumbnails from TIFF image.
define THUMB_template =
images/jpg/$(1)/%-th.jpg: images/orig/$(1)/%.tif
	convert $$< -strip -quality 85 -resize ${THUMB_HEIGTH} $$@
endef

.PHONY: all
all: images/jpg ${JPG_FILES} ${THUMB_FILES}

# Image targets. Create dynamically using the eval function.
# see https://www.gnu.org/software/make/manual/html_node/Eval-Function.html#Eval-Function
$(foreach d, ${IMAGE_DIRS}, $(eval $(call JPG_template,$(d))))
$(foreach d, ${IMAGE_DIRS}, $(eval $(call THUMB_template,$(d))))

# pdf
# convert -density 300 -trim %? -quality 85 -resize ${HEIGTH} $@
# convert "$SOURCE" -compress LZW "$TARGET"

# Create dirs if missing.
images/jpg: images/orig
	mkdir $@
	for d in ${IMAGE_DIRS}; do mkdir -p $@/$$d; done

clean:
	rm -rf images/jpg
