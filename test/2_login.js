//During the test the env variable is set to test
process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let User = require("../api/models/userModel");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
const { describe, afterEach } = require("mocha");
let should = chai.should();

chai.use(chaiHttp);

describe("Login", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    User.deleteMany({}, (err) => {
      done();
    });
  });
  describe("/POST login", () => {
    it("Normal test to login user", (done) => {
      let user = {
        username: "lgreig205",
        password: "P4sSw0Rd!",
      };
      chai.request(server)
        .post("/user/register")
        .send(user)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          chai.request(server)
            .post("/user/login")
            .send(user)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(true);
              done();
            });
        });
    });
  });
  describe("/POST login", () => {
    it("Extreme test to login user", (done) => {
      let user = {
        username: "lgreig206",
        password: "Passw0rd!",
        score: 0,
      };
      chai.request(server)
        .post("/user/register")
        .send(user)
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
              done();
            });
        });
    });
  });
  describe("/POST login", () => {
    it("Exceptional 1 test worng password", (done) => {
      let user = {
        username: "lgreig207",
        password: "Passw0rd!",
        score: 0,
      };
      let wrongPassword = {
        username: "lgreig207",
        password: "P5sSw0Rd!",
        score: 0,
      };
      chai.request(server)
        .post("/user/register")
        .send(user)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          chai
            .request(server)
            .post("/user/login")
            .send(wrongPassword)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(false);
              res.body.should.have
                .property("msg")
                .eql("username or password is wrong");
                done();
            });
        });
    });
  });
  describe("/POST login", () => {
    it("Exceptional 2 test worng username", (done) => {
      let user = {
        username: "lgreig208",
        password: "P5sSw0Rd!",
        score: 0,
      };
      let wrongUsername = {
        username: "lgreig209",
        password: "P5sSw0Rd!"
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
            .post("/user/login")
            .send(wrongUsername)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(false);
              res.body.should.have
                .property("msg")
                .eql("username or password is wrong");
                done();
            });
        });
    });
  });
  describe("/POST login", () => {
    it("Exceptional 3 test worng username and password", (done) => {
      let user = {
        username: "lgreig210",
        password: "P5sSw0Rd!",
        score: 0,
      };
      let wrongUserPass = {
        username: "lgreig211",
        password: "P4sSw0Rd!",
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
            .post("/user/login")
            .send(wrongUserPass)
            .end((err, res) => {
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(false);
              res.body.should.have
                .property("msg")
                .eql("username or password is wrong");
                done();
            });
        });
    });
  });
});
