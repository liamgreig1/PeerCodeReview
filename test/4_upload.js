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

describe("Upload", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Code.deleteOne({}, (err) => {
      done();
    });
  });
  describe("/POST upload", () => {
    it("should test normal upload", (done) => {
      let user = {
        username: "lgreig214",
        password: "P4sSw0Rd!",
        score: 0,
      };
      let reviewer = {
        username: "lclyne200",
        password: "P5sSw0Rd!",
        score: 0,
      };
      chai
        .request(server)
        .post("/user/register")
        .send(user)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          chai
            .request(server)
            .post("/user/register")
            .send(reviewer)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(true);
              chai
                .request(server)
                .post("/user/login")
                .send(user)
                .end((err, res) => {
                  res.body.should.be.a("object");
                  res.body.should.have.property("success").eql(true);
                  var token = res.body.token;
                  var decoded = jwt_decode(token);
                  chai
                    .request(server)
                    .post("/user/userexists")
                    .set("Authorization", token)
                    .send(reviewer)
                    .end((err, res) => {
                      res.body.should.be.a("object");
                      res.body.should.have.property("success").eql(true);
                      var reviewerid = res.body.userId;
                      let code = {
                        filename: "HelloWorld.java",
                        filesize: 117,
                        content:
                          'class HelloWorld {public static void main(String[] args) {System.out.println("Hello, World!"); }}',
                        author: decoded.sub,
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
                          done();
                        });
                    });
                });
            });
        });
    });
  });

  describe("/POST upload", () => {
    it("should test Exteme upload filesize on the boundry", (done) => {
      let user = {
        username: "lgreig214",
        password: "P4sSw0Rd!",
      };
      let reviewer = {
        username: "lclyne200",
      };
      chai
        .request(server)
        .post("/user/login")
        .send(user)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          var token = res.body.token;
          var decoded = jwt_decode(token);
          chai
            .request(server)
            .post("/user/userexists")
            .set("Authorization", token)
            .send(reviewer)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(true);
              var reviewerid = res.body.userId;
              let code = {
                filename: "HelloWorld1.java",
                filesize: 20480,
                content:
                  'class HelloWorld\n{public static void main(String[] args)\n{\nSystem.out.println("Hello, World!");\n}}',
                author: decoded.sub,
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
                  done();
                });
            });
        });
    });
  });
  describe("/POST upload", () => {
    it("should test Exceptional upload file size too large", (done) => {
      let user = {
        username: "lgreig214",
        password: "P4sSw0Rd!",
      };
      let reviewer = {
        username: "lclyne200",
      };
      chai
        .request(server)
        .post("/user/login")
        .send(user)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          var token = res.body.token;
          var decoded = jwt_decode(token);
          chai
            .request(server)
            .post("/user/userexists")
            .set("Authorization", token)
            .send(reviewer)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(true);
              var reviewerid = res.body.userId;
              let code = {
                filename: "HelloWorld2.java",
                filesize: 30720,
                content:
                  'class HelloWorld\n{public static void main(String[] args)\n{\nSystem.out.println("Hello, World!");\n}}',
                author: decoded.sub,
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
                  res.body.should.have.property("success").eql(false);
                  res.body.should.have
                    .property("msg")
                    .eql("File size exceeds 20kb.");
                  done();
                });
            });
        });
    });
  });
  describe("/POST upload", () => {
    it("should test Exceptional upload user not logged in", (done) => {
      let code = {
        filename: "HelloWorld3.java",
        filesize: 117,
        content:
          'class HelloWorld\n{public static void main(String[] args)\n{\nSystem.out.println("Hello, World!");\n}}',
        author: "",
        reviewer: "",
        status: false,
      };
      chai
        .request(server)
        .post("/code/upload")
        .set("Authorization", "noToken")
        .send(code)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("/POST upload", () => {
    it("should test Exceptional upload to see if user has assigned themselves", (done) => {
      let user = {
        username: "lgreig214",
        password: "P4sSw0Rd!",
      };
      let reviewer = {
        username: "lgreig214",
      };
      chai
        .request(server)
        .post("/user/login")
        .send(user)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          var token = res.body.token;
          var decoded = jwt_decode(token);
          chai
            .request(server)
            .post("/user/userexists")
            .set("Authorization", token)
            .send(reviewer)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(true);
              var reviewerid = res.body.userId;
              let code = {
                filename: "HelloWorld4.java",
                filesize: 117,
                content:
                  'class HelloWorld\n{public static void main(String[] args)\n{\nSystem.out.println("Hello, World!");\n}}',
                author: decoded.sub,
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
                  res.body.should.have.property("success").eql(false);
                  res.body.should.have
                    .property("msg")
                    .eql("User can't assign themself as reviewer.");
                  done();
                });
            });
        });
    });
  });
  describe("/POST upload", () => {
    it("should test Exceptional upload if reviewer doesn't exist", (done) => {
      let user = {
        username: "lgreig214",
        password: "P4sSw0Rd!",
        score: 0,
      };
      let reviewer = {
        username: "lclyne202",
      };
      chai
        .request(server)
        .post("/user/login")
        .send(user)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          var token = res.body.token;
          chai
            .request(server)
            .post("/user/userexists")
            .set("Authorization", token)
            .send(reviewer)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(false);
              done();
            });
        });
    });
  });
  describe("/POST upload", () => {
    it("should test exceptional upload to see if no reviewer has been selected", (done) => {
      let user = {
        username: "lgreig214",
        password: "P4sSw0Rd!",
        score: 0,
      };
      chai
        .request(server)
        .post("/user/login")
        .send(user)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          var token = res.body.token;
          var decoded = jwt_decode(token);
          let code = {
            filename: "HelloWorld.java",
            filesize: 117,
            content:
              'class HelloWorld {public static void main(String[] args) {System.out.println("Hello, World!"); }}',
            author: decoded.sub,
            reviewer: "",
            status: false,
          };
          chai
            .request(server)
            .post("/code/upload")
            .set("Authorization", token)
            .send(code)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(false);
              done();
            });
        });
    });
  });
});
