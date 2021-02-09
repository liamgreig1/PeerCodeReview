'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    username: {type: String},
    password: {type: String},
    email: {type: String},
    reputationScore: {type: Number},
    title: {type: String}
});

module.exports = mongoose.model('User', UserSchema);