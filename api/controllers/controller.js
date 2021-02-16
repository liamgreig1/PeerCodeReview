'use strict';

const passport = require('passport');
const utils = require('../../lib/utils');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const passwordStrength = require('check-password-strength');
const { schema } = require('../models/model');
const router = require('express').Router();   

exports.create_a_user = function(req,res, err) {
    User.findOne({username: req.body.username})
        .then((user) => {
            if (user) {
                res.status(401).json({ success: false, msg: "User already exists" });
            }else{
                if(passwordStrength(req.body.password).id <= 1){
                    res.status(401).json({ success: false, msg: "Password entered is considered to be weak. Password must contain At least 1 lowercase alphabetical character. 1 upper case alphabetical character. Numceric character. Special character and must be longer than 8 characters" });
                }
            
                const saltHash = utils.genPassword(req.body.password);
                
                const salt = saltHash.salt;
                const hash = saltHash.hash;
            
                const newUser = new User({
                    username: req.body.username,
                    hash: hash,
                    salt: salt,
                    reputationscore: req.body.score,
                    title: req.body.title
                });
                try {
                    newUser.save()
                        .then((user) => {
                            res.status(200).json({ success: true, user: user });
                        });
            
                } catch (err) {
                    res.status(401).json({ success: false, msg: err });
                
                }
            }
        })
};

exports.login = function (req, res, next){
    User.findOne({username: req.body.username})
    .then((user) => {

        if (!user) {
            res.status(401).json({ success: false, msg: "username or password is wrong" });
        }
        
        // Function defined at bottom of app.js
        const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
        
        if (isValid) {

            const tokenObject = utils.issueJWT(user);

            res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });

        } else {

            res.status(401).json({ success: false, msg: "username or password is wrong" });

        }

    })
    .catch((err) => {   
        next(err);
    });
}

exports.protected = function(req, res, next) {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
}