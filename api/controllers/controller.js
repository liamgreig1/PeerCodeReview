'use strict';

// const passport = require('passport');
const utils = require('../../lib/utils');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const passwordStrength = require('check-password-strength');
const { schema } = require('../models/model');

exports.list_all_users = function(req, res) {

    User.find({}, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
};

function check(field, uname, callback) {
    User.countDocuments({field:uname}, function(err, user){
        callback(err, !! user);
    })
}

exports.doesUserExist = function(req, res){
    const username = "username";
    check(username, req.body.username, function(err,exists){
        if(err){
            res.json({ success: false, msg: err });
        }
        if(exists){
            return res.json({ msg: true });
        }else{
            return res.json({ msg: false });
        }
    })
}

exports.doesEmailExist = function(req, res){
    const email = "email";
    check(email, req.body.email, function(err,exists){
        if(err){
            res.json({ success: false, msg: err });
        }
        if(exists){
            return res.json({ msg: true });
        }else{
            return res.json({ msg: false });
        }
    })
}

exports.create_a_user = function(req,res) {

    if(passwordStrength(req.body.password).id == 0){
        return res.json({ success: false, msg: "Password entered is considered to be weak\nPassword must contain\nAt least 1 lowercase alphabetical character\n1 upper case alphabetical character\n1 numceric character\n1 special character\nMust be longer than 6 characters" });
    }
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        email: req.body.email,
        reputationscore: 0,
        title: req.body.title
    });

    try {
        newUser.save()
            .then((user) => {
                res.json({ success: true, user: user });
        });
        
    } catch (err) {
        res.json({ success: false, msg: err });
    
    }

};