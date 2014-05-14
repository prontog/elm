## Document Preparation Tips

Most of the text was extracted from *PDF* files. **Calibre** was used to convert from PDF to TXT with *markdown* formating and *unix* line ending style.

Then an editor that can handle multi-line regex was used to fix several issues:

* remove whitespace at the end of a line:
s/\s+$//

* concatenate lines that were separated by - 
s/-\n+/ /

* concatenate lines that were separated by ,
s/(,)\n/\1 /
