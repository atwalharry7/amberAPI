#!/usr/bin/python

# Python script that uses subprocess to take in a submitting image from the amber alert system and runs it through the Rank one command line interface

import sys,os,subprocess,json


# Main method where most of the logic occurs
def logic(subjectID):
    
    outputLocation = "/home/harry/Projects/amberAPI/public/results/" + subjectID + "/"
    src = outputLocation + subjectID 
    
    '''
    # Represent input image in ROC template 
    subprocess.call(["/home/harry/Algorithms/RankOne/bin/roc-represent", src, outputLocation + subjectID + "_probe.t"])

    # Perform comparison using rank one
    subprocess.call(["/home/harry/Algorithms/RankOne/bin/roc-search", "-k", "3", "/home/harry/Algorithms/RankOne/bin/ASROC.t",outputLocation + subjectID + "_probe.t", outputLocation + subjectID + "_ROCRAW.json" ])
    '''
    #Using json parsing, parse out paths and scores and append to top results file 
    #Open JSON results file 
    jsonContents = ""
    with open(outputLocation + subjectID + "_ROCRAW.json") as file:
        jsonContents = json.load(file)
    
    matchNames = []
    matchScores = []

    for i in jsonContents:
        for j in i['Candidates']:
            matchPath = j['Path']
            matchScores.append(j['Similarity'])
            matchNames.append(matchPath[53:])

    with open(outputLocation + "topScores.csv", "a+") as file:
        file.write("Rank One\n")
        for i in range(len(matchNames)):
            file.write(matchNames[i] + " , " + str(matchScores[i]) + "\n")




