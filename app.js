var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var version = {version: 1.0}

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
    //res.send(version)
    res.json(version)
})

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
    Spotting.addSpotting(spotting, function (err, spotting) {    //Pass in the callback, which is an error and a spotting object
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

// ---------------------------- IMAGE -------------------------
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
})

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

// Enter in a new image
app.post('/api/image', function(req, res){
    //Access the Image object and all of its properties and functions. This is where the body parser will be used
    //TODO: Change this around so that this funciton will store the image in the public directory and return the path, that path is stored in mongo
    var image = req.body; //Allows us to access everything that comes into the form.
    Image.addImage(image, function (err, image) {
        //If there is an error, throw the error
        if (err){
            throw err;
        }
        //if there is no error, then we want to return the json of the image object from mongo.
        res.json(image); //Respond with the Image.
    });
})

app.listen(3030);

console.log("The application is running....");

