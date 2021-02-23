const mongoose = require("mongoose");
const router = require("express").Router();
const Code = mongoose.model("code");
const User = mongoose.model("user");
const passport = require("passport");

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

    var addComment = false;
    var comment = req.body.comment;
    var username = req.body.username;
    var code = req.body.code_id;

    if (comment.length > 120) {
      addComment = false;
      res.status(413).json({ success: false, msg: "Comment greater than 120 characters"});
    }

    Code.findOne({ _id: code}).then((code) => {
      if (!code) {
        addComment = false;
        res.status(403).json({ success:false, msg:"Code does not exist"});
      }
    });

    User.findOne({username: username}).then((user) => {
      if (!user) {
        addComment = false;
        res.status(403).json({ success:false, msg:"User commenting does not exist"});
      }
    })

    try {
      var newComment = {
        comment: comment,
        username: username
      }
      Code.updateOne(
        {_id: code},
        {$push: {comments: newComment}
      }).then((comment) => {
        res.status(200).json({ success: true, comment: comment});
        });
    } catch (err) {
      res.status(400).json({ success: false, msg: err });
    }
  }
);

module.exports = router;