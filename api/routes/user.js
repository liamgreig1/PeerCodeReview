const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('user');
const passport = require('passport');
const passwordStrength = require('check-password-strength');
const utils = require('../../lib/utils');

/**
 * To log user into the application and assign JavaScript Web Token for authentication purposes
 * @param {object} req Json object from route
 * @param {object} res Json object which contains outcome of request
 * @param {function} next If login fails then the next function keeps
 *  the request moving and doesn't just let the request timeout or hang for a long time.
 */
// http://localhost:3000/user/login
router.post('/login', function(req, res, next){
    User.findOne({username: req.body.username})
    .then((user) => {

        if (!user) {
            res.status(400).json({ success: false, msg: "username or password is wrong" });
        }
        
        // Function defined at bottom of app.js
        const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
        
        if (isValid) {

            const tokenObject = utils.issueJWT(user);

            res.status(202).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });

        } else {

            res.status(400).json({ success: false, msg: "username or password is wrong" });

        }

    })
    .catch((err) => {   
        next(err);
    });
});

/**
 * Creates new user in database as long as user does not already exist,
 * also that the password meets the requirements
 * @param {object} req Json object from route
 * @param {object} res Json object which contains outcome of request
 */
// http://localhost:3000/user/register
router.post('/register', function(req, res, next){
    User.findOne({username: req.body.username})
    .then((user) => {
        if (user) {
            res.status(403).json({ success: false, msg: "User already exists" });
        }else{
            if(passwordStrength(req.body.password).id <= 1){
                res.status(400).json({ success: false, msg: "Password entered is considered to be weak. " +
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
                reputationscore: req.body.score
            });
            try {
                newUser.save()
                    .then((user) => {
                        res.status(201).json({ success: true, user: user });
                    });
        
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            
            }
        }
    })
});

/**
 * Provides means of authentication of a user to allow them to access protected resources
 * @param {object} req Json object from route
 */
// http://localhost:3000/user/protected
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(202).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

module.exports = router;