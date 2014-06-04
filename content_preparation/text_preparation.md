# Document Preparation Tips

## Text Extraction

Most of the text was extracted from *PDF* files. **Calibre** was used to convert from PDF/DOCX to *ansi* TXT with *markdown* formating and *unix* line ending style.

## Common Text Preparation

An editor that can handle multi-line regex was used to fix several issues.

#### For text extracted from PDF files the following were usually used:

* remove whitespace at the end of a line

        s/\s+$//

* concatenate lines that were separated by -

        s/-\n+/ /

* concatenate lines that were separated by ,

        s/(,)\n/\1 /

#### For text extracted from DOCX files the following were usually used:

* Remove "- " following a letter. This is for the lines that were separated by - in the original document. When extracted from the .docx file, the lines were concatenated (and rightfully so) by Calibre.

        s/(\w)- /\1/

## Specific Text Preparation

For some of the documents specific steps where made:

#### To split the text extracted from the **catalog** PDF:

* A special separator was added before each line beginning with a number and a dot

        sed '/^[0-9][0-9]*\./i\
        @@
        ' Katalogos_Calibre.txt | awk '
        BEGIN { RS = "@@"; } 
        NR > 1 {
            outFile = "out/" NR ".html.md"
            print "---" > outFile 
            print "title: " > outFile
            print "author: "  > outFile
            print "contributors: " > outFile
            print "editions: " > outFile 
            print "    - number: 1" > outFile 
            print "      date: " > outFile 
            print "      place: Αθήνα" > outFile 
            print "      pages: " > outFile 
            print "      info: " > outFile 
            print "      isbn: " > outFile 
            print "      price: " > outFile 
            print "tag: [  ]" > outFile     
            print "info: " > outFile
            print "---" > outFile 
            print > outFile 
        }'

#### To prepare the text extracted from the **timeline** DOCX:

* Remove the header from the docx.
* Add a h2 header to all lines containing just a YYYY date

        s/^(\d{4})$/\n## \1/
* Add a h2 header to all lines beginning with 

        s/^(Περίοδος)/## \1/
* Add a h3 header to all lines containing a single word in capital

        s/^(ΔΙΑΛΕΞΕΙΣ|ΔΙΑΛΕΞΗ|ΔΙΗΜΕΡΙΔΑ|ΕΚΔΗΛΩΣΗ|ΕΚΔΟΣΕΙΣ|ΗΜΕΡΙΔΑ|ΗΜΕΡΙΔΕΣ|ΙΔΡΥΣΗ|ΟΜΙΛΙΑ|ΟΜΙΛΙΕΣ|ΣΥΜΠΟΣΙΟ|ΣΥΝΕΔΡΙΟ|ΠΑΡΟΥΣΙΑΣΗ ΒΙΒΛΙΟΥ)$/### \1/

Note that most of these words where extracted with the following bash pipeline:

        sed -n '/^\w*$/p' Xronologio.txt | sort -u | awk '{ text = text $0 "|" } END { print text }'

