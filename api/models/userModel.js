'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    hash: String,
    salt: String,
    reputationscore: Number
});

module.exports = mongoose.model('user', UserSchema);