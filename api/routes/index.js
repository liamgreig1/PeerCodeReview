const router = require('express').Router();

// Use the routes defined in `./user.js` for all activity to http://localhost:3000/user/
router.use('/user', require('./user'));
router.use('/code', require('./code'));

module.exports = router;