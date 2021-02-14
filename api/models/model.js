'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String
        //,unique: true
    },
    hash: String,
    salt: String,
    email: {
        type: String
        //,unique : true
    },
    reputationScore: Number,
    title: String
});

module.exports = mongoose.model('user', UserSchema);