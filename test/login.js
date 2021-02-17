//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../api/models/model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { describe, afterEach } = require("mocha");
let should = chai.should();

chai.use(chaiHttp);

describe('user', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.deleteOne({}, (err) => {
           done();
        });
    })
    describe('/POST login', () => {
        it('Normal test to login user', (done) => {
            let user = {
                username: "lgreig200",
                password: "P4sSw0Rd!",
                score: 0,
                title: "Student"
            }
            chai.request(server)
                .post('/user/register')
                .send(user)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    chai.request(server)
                        .post('/user/login')
                        .send(user)
                        .end((err, res) => {
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            done();
                        });
                });
        });
    });
    describe('/POST login', () => {
        it('Extreme test to login user', (done) => {
            let user = {
                username: "lgreig201",
                password: "Passw0rd!",
                score: 0,
                title: "Student"
            }
            chai.request(server)
                .post('/user/register')
                .send(user)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    chai.request(server)
                        .post('/user/login')
                        .send(user)
                        .end((err, res) => {
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            done();
                        });
                });
        });
    });
    describe('/POST login', () => {
        it('Exceptional 1 test worng password', (done) => {
            let user = {
                username: "lgreig203",
                password: "Passw0rd!",
                score: 0,
                title: "Student"
            }
            let wrongPassword = {
                username: "lgreig203",
                password: "P5sSw0Rd!",
                score: 0,
                title: "Student"
            }
            chai.request(server)
                .post('/user/register')
                .send(user)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    chai.request(server)
                        .post('/user/login')
                        .send(wrongPassword)
                        .end((err, res) => {
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(false);
                            res.body.should.have.property('msg').eql('username or password is wrong');
                            done();
                        });
                });
        });
    });
    describe('/POST login', () => {
        it('Exceptional 2 test worng username', (done) => {
            let user = {
                username: "lgreig200",
                password: "P5sSw0Rd!",
                score: 0,
                title: "Student"
            }
            let wrongPassword = {
                username: "lgreig203",
                password: "P5sSw0Rd!",
                score: 0,
                title: "Student"
            }
            chai.request(server)
                .post('/user/register')
                .send(user)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    chai.request(server)
                        .post('/user/login')
                        .send(wrongPassword)
                        .end((err, res) => {
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(false);
                            res.body.should.have.property('msg').eql('username or password is wrong');
                            done();
                        });
                });
        });
    });
    describe('/POST login', () => {
        it('Exceptional 3 test worng username and password', (done) => {
            let user = {
                username: "lgreig200",
                password: "P5sSw0Rd!",
                score: 0,
                title: "Student"
            }
            let wrongPassword = {
                username: "lgreig203",
                password: "P4sSw0Rd!",
                score: 0,
                title: "Student"
            }
            chai.request(server)
                .post('/user/register')
                .send(user)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    chai.request(server)
                        .post('/user/login')
                        .send(wrongPassword)
                        .end((err, res) => {
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(false);
                            res.body.should.have.property('msg').eql('username or password is wrong');
                            done();
                        });
                });
        });
    });
});