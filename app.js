var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var version = {version: "0.1.15"}
var storageDestination = "public/submissions/";
var multer = require('multer');

var debugCounter = 0;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, storageDestination)
    },
    filename: function (req, file, cb) {
        cb(null, req.body["imageName"])
    }
});
var upload = multer({storage: storage});

app.use(bodyparser.json());

//Connect to mongoose
mongoose.connect('mongodb://localhost/amberscan');

var db = mongoose.connection;
Spotting = require('./models/spotting');
Image = require('./models/images');

app.get('/' , function(req, res){
  res.send('Welcome to the Amber Scan server! /n Use /version to get the current app version. ');
});

app.get('/version', function(req, res){
    console.log("VersionNumberCalled");
    //res.send(version)
    res.json(version)
})
app.use(express.static('./public'))

// ---------------------------- Spotting Table -------------------------
//Route to get all the spottings in the system
app.get('/api/spottings', function(req, res){
    //Access the Spotting object and all of its properties and functions.
    Spotting.getSpottings(function (err, spotting) {    //Pass in the callback, which is an error and a spotting object
        //If there is an error, throw the rror
        if (err){
            throw err;
        }
        //if there is no error, then we want to return the json of the spotting object from mongo.
        res.json(spotting);
    });
})

//Route if you want to just get a specific spotting
app.get('/api/spotting/:_id', function(req, res){
    //Access the Spotting object and all of its properties and functions.
    Spotting.getSpottingById(req.params._id, function (err, spotting) {    //Pass in the callback, which is an error and a spotting object
        //If there is an error, throw the rrror
        if (err){
            throw err;
        }
        //if there is no error, then we want to return the json of the spotting object from mongo.
        res.json(spotting);
    });
})

// Enter in a new spottings
app.post('/api/spotting', function(req, res){
    //Access the Spotting object and all of its properties and functions. This is where the body parser will be used
    var spotting = req.body; //Allows us to access everything that comes into the form.
    Spotting.addSpotting(spotting, function (err, spotting) {    //Pass in the callback, which is an error and the callback
        //If there is an error, throw the rror
        if (err){
            throw err;
            print(err);
        }
        //if there is no error, then we want to return the json of the spotting object from mongo.
        res.json(spotting); //Respond with the spotting.
    });
})

// Update an entered spotting
app.put('/api/spotting/:_id', function(req, res){
    var id = req.params._id;
    var spotting = req.body;
    Spotting.updateSpotting(id,  spotting, {}, function (err, spotting) {
        if (err){
            throw err;
        }
        res.json(spotting); //Respond with the spotting.
    });
})

// Delete an entered spotting
app.delete('/api/spotting/:_id', function(req, res){
    var id = req.params._id;
    Spotting.deleteSpotting(id, function (err, spotting) {
        if (err){
            throw err;
        }
        res.json(spotting); //Respond with the spotting.
    });
})

// ---------------------------- IMAGE Table -------------------------
//Route that will store the image onto disk under /public/submissions, it will also add an entry to the database with the storage location
app.post('/api/upload', upload.single('image'), function(req, res, next) {
    //console.log('File Data according to multer: ' + JSON.stringify(req.file));
    debugCounter += 1
    console.log("Image Received at api/upload endpoint. Counter : " + debugCounter);

    //Store the image data into the mongo db under image

    var imageName = req.body['imageName'];
    var imageLocation = storageDestination + req.body['imageName'];
    imageModel = {"imageID": req.body['imageName'], "location": imageLocation};
    console.log("The image location is " + imageLocation);
    Image.addImage(imageModel, function (err, image) {
        //If there is an error, throw the error
        if (err) {
            throw err;
        }
        //if there is no error, then we want to return the json of the image object from mongo.
        //res.json(image); //Respond with the Image.
    });


    //res.status(301).send("Success");

    // ----------------------------------- Rank One -------------------------------------------
    var spawn = require('child_process').spawn;
    //TODO The image name is set temporarily to a static image
    //imageName = "/home/harry/IMG_8587.png"
    
    // Create a python process with the python script which runs FR algorithms. pass in image name 
    var pyROC = spawn('python', ['/home/harry/Projects/openBR/FRopenBR.py', imageName]);
    //var pyROC = spawn('python', ['/home/harry/Algorithms/RankOne/python/enrollAnalyze.py', imageName]);
    var dataString = ''

    /*Here we are saying that every time our node application receives data from the python process output stream(on 'data'),
    we want to convert that received data into a string and append it to th overall dataString.*/
    pyROC.stdout.on('data', function(data){
        dataString += data.toString();
    });

    /*Once the stream is done (on 'end') we want to simply log the received data to the console.*/
    pyROC.stdout.on('end', function(){
        //console.log('Output of data \n ----------------- \n' ,dataString);
        console.log('Output of data for python \n');
        console.log(dataString);
        console.log("End printing")
        res.write(dataString);
        res.end();

    });

    // Now we need to parse the data returned by python.




    //res.status(279).send("Success");
});

//Route to get all the images in the system
app.get('/api/images', function(req, res){
    //Access the Spotting object and all of its properties and functions.
    Image.getImages(function (err, image) {    //Pass in the callback, which is an error and a spotting object
        //If there is an error, throw the rror
        if (err){
            throw err;
        }
        //if there is no error, then we want to return the json of the spotting object from mongo.
        res.json(image);
    });
});

//Route if you want to just get a specific image
app.get('/api/image/:_id', function(req, res){
    //Access the Spotting object and all of its properties and functions.
    Image.getImageById(req.params._id, function (err, image) {    //Pass in the callback, which is an error and a spotting object
        //If there is an error, throw the rrror
        if (err){
            throw err;
        }
        //if there is no error, then we want to return the json of the spotting object from mongo.
        res.json(image);
    });
})

// ---------------------------- DEBUG -------------------------
//Debug route that will just take a post request and the JSON content posted within it and output it to the console.
app.post('/api/debug', function(req, res)
{
    var submitData = req.body;
    console.log("Image Received at api/debug endpoint, Contents: \n");
    console.log(req.body)
    //res.status(200).send("Good communication");
    res.json({"id":"1001"});
});

app.post('/api/debugUpload',upload.single("image"), function(req, res, next){
    debugCounter += 1
    console.log("Image Received at api/debugUpload endpoint. Counter : " + debugCounter);
    //console.log('File Data according to multer: ' + JSON.stringify(req.body));

    /*
    //Store the image data into the mongo db under image
    var imageLocation = storageDestination + req.body['imageName'];
    imageModel = {"imageID": req.body['imageName'], "location" : imageLocation};
    console.log("The image location is " + imageLocation);
    Image.addImage(imageModel, function (err, image) {
        //If there is an error, throw the error
        if (err){
            throw err;
        }
        //if there is no error, then we want to return the json of the image object from mongo.
        //res.json(image); //Respond with the Image.
    });
    */

    res.status(279).send("Success");

});


app.listen(3030);

console.log("The application is running....");



