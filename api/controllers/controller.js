'use strict';

const passport = require('passport');
const utils = require('../../lib/utils');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const passwordStrength = require('check-password-strength');
const { schema } = require('../models/model');
const router = require('express').Router();   

exports.create_a_user = function(req,res, err) {

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

exports.login = function (req, res, next){
    User.findOne({username: req.body.username})
    .then((user) => {

        if (!user) {
            res.status(401).json({ success: false, msg: "could not find user" });
        }
        
        // Function defined at bottom of app.js
        const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
        
        if (isValid) {

            const tokenObject = utils.issueJWT(user);

            res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });

        } else {

            res.status(401).json({ success: false, msg: "you entered the wrong password" });

        }

    })
    .catch((err) => {   
        next(err);
    });
}

exports.protected = function(req, res, next) {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
}

exports.doesUserExist = function(req, res){
    checkUser(req.body.username, function(err,exists){
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
    checkEmail(req.body.email, function(err,exists){
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

function checkUser(uname, callback) {
    User.countDocuments({username:uname}, function(err, user){
        callback(err, !! user);
    })
}

function checkEmail(email, callback) {
    User.countDocuments({email:email}, function(err, user){
        callback(err, !! user);
    })
}