run:
	docpad run

generate:
	# Generate the static site.
	echo Cleaning out directory...
	docpad clean
	echo Generating static site...
	docpad generate
	# Execute Grunt file.
	grunt
	# Delete images
	rm -rf out/images
	# Delete documents
	rm -rf out/documents
	cd out && zip -r elm_$$(date +%Y%m%d).zip *

install:
	npm install -g docpad@6.79.4
	npm install -g grunt@0.4.5
	npm install grunt-cli@0.1.13 -g
