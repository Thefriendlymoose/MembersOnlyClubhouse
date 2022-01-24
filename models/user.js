const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    admin: {type: Boolean, default: false},
    ismember: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);