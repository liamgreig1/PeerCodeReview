'use strict';

// const passport = require('passport');
const utils = require('../../lib/utils');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const passwordStrength = require('check-password-strength')

exports.list_all_users = function(req, res) {

    User.find({}, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
};

exports.create_a_user = function(req,res) {
    const uname = req.body.username;
    let userExists = false;

    // User.findOne({username:uname} ,{"username.$":1, _id:0},function(err, user){
    //     if(err){
    //         res.send(err);
    //     }
    //     if(user.username == uname){
    //         console.log("IF 1");
    //         userExists=true;
    //         console.log("1"+userExists);
    //     }
    // });

    if(passwordStrength(req.body.password).id == 0){
        return res.json({ success: false, msg: "Password entered is considered to be weak\nPassword must contain\nAt least 1 lowercase alphabetical character\n1 upper case alphabetical character\n1 numceric character\n1 special character\nMust be longer than 6 characters" });
    }

    // console.log("2"+userExists);
    // if (userExists==true) {
    //     console.log("IF 2");
    //     return res.json({ success: false, msg: "Username already exists" });
    // }
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