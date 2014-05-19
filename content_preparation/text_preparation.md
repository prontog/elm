## Document Preparation Tips

Most of the text was extracted from *PDF* files. **Calibre** was used to convert from PDF to TXT with *markdown* formating and *unix* line ending style.

Then an editor that can handle multi-line regex was used to fix several issues:

* remove whitespace at the end of a line:
s/\s+$//

* concatenate lines that were separated by - 
s/-\n+/ /

* concatenate lines that were separated by ,
s/(,)\n/\1 /


For some of the documents specific steps where made:

### To split the text extracted from the catalog PDF:
* A special separator was added before each line beginning with a number and 
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


    