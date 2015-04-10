// Load required packages
var mongoose = require('mongoose');

// Define our User schema
var UserSchema = new mongoose.Schema({
    name: String,
    email: String
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);