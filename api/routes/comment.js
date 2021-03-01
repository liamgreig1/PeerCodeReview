const mongoose = require("mongoose");
const router = require("express").Router();
const Code = mongoose.model("code");
const User = mongoose.model("user");
const passport = require("passport");
const sanitize = require("mongo-sanitize");

/**
 * receive code from user and save to database
 * @param {object} req Json object from route
 * @param {object} res Json object which contains outcome of request
 * @param {function} next If login fails then the next function keeps
 *  the request moving and doesn't just let the request timeout or hang for a long time.
 */
// http://localhost:3000/code/comment/addComment
router.post(
  "/addcomment",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    var addComment = true;
    
    var comment = sanitize(req.body.comment);
    var username = sanitize(req.body.userid);
    var code = sanitize(req.body.codeid);

    Code.findOne({ _id: code }).then((code) => {
      if (!code) {
        addComment = false;
        res.status(403).json({ success: false, msg: "Code does not exist" });
      }

      if (code.reviewer != username) {
        addComment = false;
        res
          .status(403)
          .json({
            success: false,
            msg: "You have not been assigned to review this code",
          });
      }

      if (comment.length > 120) {
        addComment = false;
        res
          .status(413)
          .json({ success: false, msg: "Comment greater than 120 characters" });
      }

      if (addComment == true) {
        var newComment = {
          comment: comment,
          user_id: username,
        };
        try {
          Code.updateOne(
            { _id: code },
            { $push: { comments: newComment } }
          ).then((comment) => {
            res.status(201).json({ success: true, comment: comment });
          });
        } catch (err) {
          res.status(400).json({ success: false, msg: err });
        }
      }
    });
  }
);

module.exports = router;
