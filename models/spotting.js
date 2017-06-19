/**
 * Created by Harry on 5/15/2017.
 * This is the schema used to link the mongo db collection spottings to the api.
 * This is where the database interactions take place
 *
 */

var mongoose = require('mongoose');

//Spotting Schema
var spottingSchema = mongoose.Schema({
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

// Get all the spottings
module.exports.getSpottings = function (callback, limit) {
    //Execute the same function you would in mongodb, but you can execute it from the route.
    spotting.find(callback).limit(limit);
};

// Get a specific spotting by its id
module.exports.getSpottingById = function (id, callback) {
    //Execute the same function you would in mongodb, but you can execute it from the route.
    spotting.findById(id, callback);
};

// Add a spotting
module.exports.addSpotting = function (_spotting, callback) {
    //Execute the same function you would in mongodb, but you can execute it from the route.
    spotting.create(_spotting, callback);
};

// Update a spotting
module.exports.updateSpotting = function (id, _spotting, options, callback) {
    var query = {_id: id }; //this is whats used to locate the appropriate entry in the spottings table to update.
    var update = {
        name: _spotting.name
    };
    spotting.findOneAndUpdate(query, update, options, callback); //pass the variables to mongo for processing.
}

// Delete a spotting
module.exports.deleteSpotting = function (id, callback){
    var query = {_id:id}; //Create the query that will be passed to mongo, the id of the entry that needs to be deleted.
    spotting.remove(query, callback);
}