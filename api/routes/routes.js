'use strict';
const passport = require('passport');
module.exports = function(app) {
  var user = require('../controllers/controller');

  app.route('/register')
    .post(user.create_a_user);
  app.route('/login')
    .post(user.login)
  app.route('/protected')
    .get(user.protected, passport.authenticate('jwt', { session: false }))
};