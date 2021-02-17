//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../api/models/model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { describe } = require("mocha");
let should = chai.should();

chai.use(chaiHttp);

describe('user', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => {
           done();
        });
    })
    describe('/POST register', () => {
        it('Normal test to register user', (done) => {
            let user = {
                username: "lgreig200",
                password: "P4sSw0Rd!",
                score: 0
            }
          chai.request(server)
              .post('/user/register')
              .send(user)
              .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                done();
              });
        });
    });
    describe('/POST register', () => {
        it('Extreme test to register user', (done) => {
            let user = {
                username: "lgreig201",
                password: "Passw0rd!",
                score: 0
            }
          chai.request(server)
              .post('/user/register')
              .send(user)
              .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                done();
              });
        });
    });
    describe('/POST register', () => {
        it('Exceptional 1 test Password length', (done) => {
            let user = {
                username: "lgreig202",
                password: "Pass",
                score: 0
            }
          chai.request(server)
              .post('/user/register')
              .send(user)
              .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('msg').eql('Password entered is considered to be weak. Password must contain At least 1 lowercase alphabetical character. 1 upper case alphabetical character. Numceric character. Special character and must be longer than 8 characters');
                done();
              });
        });
    });
    describe('/POST register', () => {
        it('Exceptional 2 test Password complexity', (done) => {
            let user = {
                username: "lgreig202",
                password: "Password1",
                score: 0
            }
          chai.request(server)
              .post('/user/register')
              .send(user)
              .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('msg').eql('Password entered is considered to be weak. Password must contain At least 1 lowercase alphabetical character. 1 upper case alphabetical character. Numceric character. Special character and must be longer than 8 characters');
                done();
              });
        });
    });
    describe('/POST register', () => {
        it('Exceptional 3 test user exists', (done) => {
            let user = {
                username: "lgreig200",
                password: "P4sSw0Rd!",
                score: 0
            }
            chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                  res.body.should.be.a('object');
                  res.body.should.have.property('success').eql(true);
                  done();
            });
            chai.request(server)
            .post('/user/register')
            .send(user)
            .end((err, res) => {
                  res.body.should.be.a('object');
                  res.body.should.have.property('success').eql(false);
                  res.body.should.have.property('msg').eql('User already exists');
                  done();
            });
        });
    });
});





