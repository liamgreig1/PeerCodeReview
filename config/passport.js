// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('user');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// TODO
const options = {
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // secretOrKey: PUB_KEY,
    // algorithms: ['RS256']
};

// TODO
module.exports = (passport) => {}