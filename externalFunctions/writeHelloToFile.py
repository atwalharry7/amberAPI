#!/usr/bin/python
#tHis sample script will just write out to the file out.txt, Hello world and the number of lines in the file at the time. 
import sys

print("Variable passed in " + sys.argv[1])
# /Read the number of lines in the file 
lineCount = 0
try:
    with open("/home/harry/Projects/amberAPI/externalFunctions/output.txt", 'r') as file: 
        for line in file : 
            lineCount += 1
except:
    lineCount = 0

#Open the file for editing
with open("/home/harry/Projects/amberAPI/externalFunctions/output.txt", 'a') as file: 
    # Write out 'Hello World', and the number of lines currently in the file
    file.write('Hello World : ' + str(lineCount) + '\n')


