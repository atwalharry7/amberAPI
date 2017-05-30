/**
 * Created by Harry on 5/15/2017.
 * This is the schema used to link the mongo db collection spottings to the api.
 * This is where the database interactions take place
 */

var mongoose = require('mongoose');

//Spotting Schema
var imageSchema = mongoose.Schema({
    location:{
        type: String,
        required: true
    }
});

var image = module.exports = mongoose.model('images', imageSchema);

// Get all the spottings
module.exports.getImages = function (callback, limit) {
    //Execute the same function you would in mongodb, but you can execute it from the route.
    image.find(callback).limit(limit);
};

// Get a specific spotting by its id
module.exports.getImageById = function (id, callback) {
    //Execute the same function you would in mongodb, but you can execute it from the route.
    image.findById(id, callback);
};

// Add a spotting
module.exports.addImage = function (_image, callback) {
    //Execute the same function you would in mongodb, but you can execute it from the route.
    image.create(_image, callback);
};