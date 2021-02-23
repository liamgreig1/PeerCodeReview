'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    comment: String,
    username: String,
    timestamp: { type: Date, default: Date.now }
})

var CodeSchema = new Schema({
    filename: String,
    filesize: Number,
    content: String,
    timestamp: { type: Date, default: Date.now },
    author: String,
    reviewer: String,
    status: Boolean,
    comments: [CommentSchema]
});

module.exports = mongoose.model('code', CodeSchema);
module.exports = mongoose.model('comments', CommentSchema);