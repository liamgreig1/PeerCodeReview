'use strict';
module.exports = function(app) {
  var user = require('../controllers/controller');

  app.route('/listofusers')
    .get(user.list_all_users);
  app.route('/register')
    .post(user.create_a_user);
  app.route('/doesUserExist')
    .post(user.doesUserExist)
  app.route('/doesEmailExist')
    .post(user.doesEmailExist)
};