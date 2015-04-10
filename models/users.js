// Load required packages
var mongoose = require('mongoose');

// Define our User schema
var UserSchema = new mongoose.Schema({
    //_id: Number,
    name: String,
    email: String,
    pendingTasks: [String],
    dateCreated: {type: Date, default: Date.now}
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);