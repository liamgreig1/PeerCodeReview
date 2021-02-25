//During the test the env variable is set to test
process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let User = require("../api/models/userModel");
let Code = require("../api/models/codeModel");

//Require the dev-dependencies
let jwt_decode = require("jwt-decode");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
const { describe } = require("mocha");
let should = chai.should();

chai.use(chaiHttp);

describe("Comment", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Code.deleteOne({}, (err) => {
      done();
    });
  });
  describe("/POST comment", () => {
    it("should test normal comment", (done) => {
      let user = {
        username: "lgreig214",
        password: "P4sSw0Rd!",
      };
      let reviewer = {
        username: "lclyne200",
        password: "P5sSw0Rd!",
      };
      chai
        .request(server)
        .post("/user/login")
        .send(user)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          var token = res.body.token;
          var udecoded = jwt_decode(token);
          chai
            .request(server)
            .post("/user/userexists")
            .set("Authorization", token)
            .send(reviewer)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(true);
              var reviewerid = res.body.msg._id;
              let code = {
                filename: "HelloWorld.java",
                filesize: 117,
                content:
                  'class HelloWorld {public static void main(String[] args) {System.out.println("Hello, World!"); }}',
                author: udecoded.sub,
                reviewer: reviewerid,
                status: false,
              };
              chai
                .request(server)
                .post("/code/upload")
                .set("Authorization", token)
                .send(code)
                .end((err, res) => {
                  res.body.should.be.a("object");
                  res.body.should.have.property("success").eql(true);
                  var codeid = res.body.code._id;
                  chai
                    .request(server)
                    .post("/user/login")
                    .send(reviewer)
                    .end((err, res) => {
                      res.body.should.be.a("object");
                      res.body.should.have.property("success").eql(true);
                      var rtoken = res.body.token;
                      var rdecoded = jwt_decode(rtoken);
                      let comment = {
                        comment: "Code Looks good",
                        userid: rdecoded.sub,
                        codeid: codeid,
                      };
                      chai
                        .request(server)
                        .post("/code/comment/addcomment")
                        .set("Authorization", rtoken)
                        .send(comment)
                        .end((err, res) => {
                          res.body.should.be.a("object");
                          res.body.should.have.property("success").eql(true);
                          done();
                        });
                    });
                });
            });
        });
    });
  });
});
