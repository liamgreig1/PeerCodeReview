const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("user");
const passport = require("passport");
const passwordStrength = require("check-password-strength");
const utils = require("../../lib/utils");
const sanitize = require("mongo-sanitize");

/**
 * To log user into the application and assign JavaScript Web Token for authentication purposes
 * @param {object} req Json object from route
 * @param {object} res Json object which contains outcome of request
 * @param {function} next If login fails then the next function keeps
 *  the request moving and doesn't just let the request timeout or hang for a long time.
 */
// http://localhost:3000/user/login
router.post("/login", function (req, res, next) {
  var pUser = sanitize(req.body.username);
  var pPassword = sanitize(req.body.password);
  var loguserIn = true;
  var errors = new Array();

  User.findOne({ username: pUser })
    .then((user) => {
      if (pUser) {
        if (!user) {
          loguserIn = false;
          errors.push("Username or password is wrong ");
        }
      } else {
        loguserIn = false;
        errors.push("Must enter a username ");
        // res.status(400).json({ success: false, msg: "Must enter a username" });
      }

      if (!pPassword) {
        loguserIn = false;
        errors.push("Must enter a password ");
        // res.status(400).json({ success: false, msg: "Must enter a password" });
      }


      if (loguserIn == true) {
        // Function defined at bottom of app.js
        const isValid = utils.validPassword(pPassword, user.hash, user.salt);

        if (isValid) {
          const tokenObject = utils.issueJWT(user);

          res
            .status(202)
            .json({
              success: true,
              token: tokenObject.token,
              expiresIn: tokenObject.expires,
            });
        } else {
          res
            .status(400)
            .json({ success: false, msg: "username or password is wrong" });
        }
      } else {
        res
          .status(400)
          .json({ success: false, msg: errors });
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
router.post("/register", function (req, res, next) {
  var addUser = true;
  var pUser = sanitize(req.body.username);
  var pPassword = sanitize(req.body.password);
  var pScore = sanitize(req.body.score);
  var errors = new Array();

  User.findOne({ username: pUser }).then((user) => {
    if (pUser) {
      if (user) {
        addUser = false;
        errors.push("User already exists ")
      }
    } else {
      addUser = false;
      errors.push("A username must be entered ")
    }

    if (pPassword) {
      if (passwordStrength(pPassword).id <= 1) {
        addUser = false;
        errors.push("Password entered is considered to be weak. " +
          "Password must contain At least 1 lowercase alphabetical character. 1 upper case alphabetical character. " +
          "Numceric character. Special character and must be longer than 8 characters ")
      }
    } else {
      addUser = false;
      errors.push("A password must be entered ")
    }


    if (addUser == true) {
      const saltHash = utils.genPassword(pPassword);

      const salt = saltHash.salt;
      const hash = saltHash.hash;

      const newUser = new User({
        username: pUser,
        hash: hash,
        salt: salt,
        reputationscore: pScore,
      });
      try {
        newUser.save().then((user) => {
          res.status(201).json({ success: true, msg: "Successful Registration" });
        });
      } catch (err) {
        res.status(400).json({ success: false, msg: err });
      }
    } else {
      res
        .status(400)
        .json({ success: false, msg: errors });
    }
  }
  );
});
// http://localhost:3000/user/userexists
router.post(
  "/userexists",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    var pUser = sanitize(req.body.username);
    User.findOne({ username: pUser }, { username: 1 }).then((user) => {
      if (user) {
        res.status(200).json({ success: true, userId: user._id, username: user.username });
      } else {
        res.status(400).json({ success: false, msg: "User does not exist" });
      }
    });
  }
);

// http://localhost:3000/user/useridexists
router.post(
  "/useridexists",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    var pUserId = sanitize(req.body._id);
    User.findOne({ _id: pUserId }, { username: 1 }).then((user) => {
      if (user) {
        res.status(200).json({ success: true, userId: user._id, username: user.username });
      } else {
        res.status(400).json({ success: false, msg: "User does not exist" });
      }
    });
  }
);
// http://localhost:3000/user/listofusers
router.get(
  "/listofusers",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    User.find({}, { username: 1 }).then((list) => {
      if (list.length > 0) {
        res.status(200).json({ success: true, msg: list });
      }
    });
  }
);

/**
 * Provides means of authentication of a user to allow them to access protected resources
 * @param {object} req Json object from route
 */
// http://localhost:3000/user/protected
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res
      .status(202)
      .json({
        success: true,
        msg: "You are successfully authenticated to this route!",
      });
  }
);

module.exports = router;
