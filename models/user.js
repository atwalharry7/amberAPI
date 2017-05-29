/**
 * Created by Harry on 5/15/2017.
 * This is the schema used to link the mongo db collection user to the api.
 * This is where the database interactions take place
 */

var mongoose = require('mongoose');

//Spotting Schema
var userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    street:{
        type: String,
        required: false
    },
    city:{
        type: String,
        required: false
    },
    zip:{
        type: String,
        required: false
    },
    contact:{
        type: String,
        required: false
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var spotting = module.exports = mongoose.model('spotting', spottingSchema);

// Get a Spotting
module.exports.getSpottings = function (callback, limit) {
    //Execute the same function you would in mongodb, but you can execute it from the route.
    spotting.find(callback).limit(limit);
}