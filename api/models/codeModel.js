'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CodeSchema = new Schema({
    filename: String,
    filesize: Number,
    content: String,
    timestamp: { type: Date, default: Date.now },
    author: String,
    reviewer: String,
    status: Boolean,
    comments: {
        comment: String,
        username: String
    }
});

module.exports = mongoose.model('code', CodeSchema);