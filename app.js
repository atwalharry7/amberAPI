var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var version = '1.0'

//Connect to mongoose
mongoose.connect('mongodb://localhost/amberscan');

var db = mongoose.connection;
Spotting = require('./models/spotting')

app.get('/' , function(req, res){
  res.send('Welcome to the Amber Scan server! /n Use /version to get the current app version. ');
});

app.get('/version', function(req, res){
    //res.send(version)
    res.json(version)
})

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
app.get('/api/spottings/:_id', function(req, res){
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

app.listen(3030);

console.log("The application is running....");

