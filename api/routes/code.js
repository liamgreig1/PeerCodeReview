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
// http://localhost:3000/code/upload
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    var upload = true;
    var filename = sanitize(req.body.filename);
    var fileSize = sanitize(req.body.filesize);
    var content = sanitize(req.body.content);
    var author = sanitize(req.body.author);
    var reviewer = sanitize(req.body.reviewer);
    var status = sanitize(req.body.status);

    if (fileSize > 20480) {
      upload = false;
      res.status(413).json({ success: false, msg: "File size exceeds 20kb." });
    }

    if(reviewer == null || reviewer == "") {
      upload = false;
      res.status(403).json({ success: false, msg: "Please select reviewer"});
    }

    User.findOne({ _id: author }).then((user) => {
      if (!user) {
        upload = false;
        res.status(403).json({ success: false, msg: "Author does not exist" });
      } else {
        if (author == reviewer) {
          upload = false;
          res.status(401).json({
            success: false,
            msg: "User can't assign themself as reviewer.",
          });
        }

        if (upload == true) {
          const newCode = new Code({
            filename: filename,
            filesize: fileSize,
            content: content,
            author: author,
            reviewer: reviewer,
            status: status,
          });

          try {
            newCode.save().then((code) => {
              res.status(200).json({ success: true, code: code });
            });
          } catch (err) {
            res.status(400).json({ success: false, msg: err });
          }
        }
      }
    });
  }
);

module.exports = router;
