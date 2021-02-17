'use strict';

const passport = require('passport');
const utils = require('../../lib/utils');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const passwordStrength = require('check-password-strength');
const { schema } = require('../models/model');
const router = require('express').Router();   

/**
 * Creates new user in database as long as user does not already exist,
 * also that the password meets the requirements
 * @param {object} req Json object from route
 * @param {object} res Json object which contains outcome of request
 */
exports.create_a_user = function(req,res) {
    User.findOne({username: req.body.username})
        .then((user) => {
            if (user) {
                res.status(401).json({ success: false, msg: "User already exists" });
            }else{
                if(passwordStrength(req.body.password).id <= 1){
                    res.status(401).json({ success: false, msg: "Password entered is considered to be weak. " +
                     "Password must contain At least 1 lowercase alphabetical character. 1 upper case alphabetical character. " +
                     "Numceric character. Special character and must be longer than 8 characters" });
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

/**
 * To log user into the application and assign JavaScript Web Token for authentication purposes
 * @param {object} req Json object from route
 * @param {object} res Json object which contains outcome of request
 * @param {function} next If login fails then the next function keeps
 *  the request moving and doesn't just let the request timeout or hang for a long time.
 */
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

/**
 * Provides means of authentication of a user to allow them to access protected resources
 * @param {object} req Json object from route
 */
exports.protected = function(res) {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
}