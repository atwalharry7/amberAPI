#!/usr/bin/python

#Short script that will take in a CSV file from open br, parse it to get the top 3 matches, and then return them by writing out to a file the filename, and confidence scores.

#Harry Atwal 11/01/2017
import os,sys,csv,json,shutil
import numpy as np
import rankOnePythonWrapper as roc
from brpy import init_brpy

#This method will take the image and perform openBR's face recognition on the image and the ITWICC gallery. It will then output the raw results to the subjectID's public directory. 
def openBRFaceRecognition(subjectID):
        outputDirectory = "/home/harry/Projects/amberAPI/public/results/" + subjectID + "/"
        imageLoc = outputDirectory + subjectID 
        print("Input image: " + str(imageLoc))
        # br_loc is /usr/local/lib by default,
        # you may change this by passing a different path to the shared objects
        br = init_brpy(br_loc='/usr/local/lib')
        br.br_initialize_default()
        br.br_set_property('algorithm','FaceRecognition') # also made up
        br.br_set_property('enrollAll','true')
        # Perform comparison of gallery and target face.
        br.br_compare("/home/harry/Projects/openBR/ITWICCGallery.gal", imageLoc, outputDirectory + "openBR_rawResults.csv")  
        print("openBR FR complete") 

#takes the raw results from an openBR face recognition, and parses out the results to output the top three to console. 
def openBRAnalysis(subjectID):
    src = "/home/harry/Projects/amberAPI/public/results/" + str(subjectID) + "/openBR_rawResults.csv"
    outputDirectory = "/home/harry/Projects/amberAPI/public/results/" + subjectID + "/"

    fileNames_ = []
    scores_ = []

    fileNames = ""
    scores = ""
    #Read in the first two lines
    with open(src, 'r') as inputFile:
        fileNames = inputFile.readline()
        scores = inputFile.readline()
        
    #parse each line as its own array of csv values
    fileNames_ = fileNames.split(',')
    scores_ = np.array(scores.split(','))
    temp = scores.split(',')
    
    #Remove the first entries since its just the file name
    del fileNames_[0]
    scores_ = scores_[1:]
    del temp[0]

    floatScores_ = []
    for i in temp:
        floatScores_.append(float(i))

    floatScores_.sort(reverse=True)
    
    #print("Number of fileNames found " + str(len(fileNames_)))
    #print("Number of Scores found " + str(len(scores_)))

    #To get confidence scores, map the match scores to between 0 and 100
    minVal = min(floatScores_)
    maxVal = max(floatScores_)

    matchingImages = []
    confidenceScores = []

    #Get the top three matches - a match score of 23.9268 is a perfect match. 
    topIndices = scores_.argsort()[-3:][::-1]    
    #topIndices = int./Scores_.argsort()[-3:][::-1]
    #print(topIndices)
    #print("Top matches")
    for i in topIndices:
        #print(fileNames_[i] + " at " + str(float(scores_[i])))
        #add normalized score to confidences array
        c_score = (float(scores_[i]) - minVal) / (maxVal - minVal) *100
        #print("Normalized Score is : " + str(c_score * 100))
        matchingImages.append(fileNames_[i])
        confidenceScores.append(c_score)

    #Print out the results in a JSON format, can be used to return one master method. 
    jsonArray = []
    for i in range(0,len(matchingImages)):
        jsonArray.append(matchingImages[i])
        jsonArray.append(confidenceScores[i])
    
    #Output top 3 images and their confidence scores to topscores file, copy images to public folder.    
    with open(outputDirectory + "topScores.csv", "a+") as file:
        file.write("openBR\n")
        for i, e  in reversed(list(enumerate(matchingImages))):
            truncName = matchingImages[i][53:]
            file.write(truncName + " , " + str(confidenceScores[i]) + "\n")
            shutil.copyfile(matchingImages[i], outputDirectory + "openBR_" + str(i) + ".jpg") 

#main Method where the image path and subject id are passed in
def main():
    print("Main analysis script called")
    
    
    imageID = ""
    src = "" 
    if not (len(sys.argv) >1):
        print("Error 20: No file provided for analysis")
        exit()
    else:
        imageID = sys.argv[1]
        src = "/home/harry/Projects/amberAPI/public/submissions/" + str(imageID)
  


    #Create the folder under public which will store the image and raw results 
    resultsDirectory = "/home/harry/Projects/amberAPI/public/results/" + str(imageID) + "/"
    if not os.path.exists(resultsDirectory):
        os.makedirs(resultsDirectory)
        shutil.copyfile(src, resultsDirectory + imageID)

    #Process image through openBR
    openBRFaceRecognition(imageID)

    #Analyze results provided by openBR
    openBRAnalysis(imageID)
    
    # Perform ROC analysis
    roc.logic(imageID)
    print("ROC anaysis complete")

    print("Analysis Complete")    



if __name__ == "__main__":
    print("FRAnalysis called")
    main()
    #openBRAnalysis("/home/harry/DataSets/SimulatedAmberDataSet/ProbeImages/CS0001_006f13.jpg")
