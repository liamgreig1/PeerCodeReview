//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../api/models/userModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { describe } = require("mocha");
let should = chai.should();

chai.use(chaiHttp);

describe('Protected', () => {
    afterEach((done) => { //after each test we empty the database
        User.deleteMany({}, (err) => {
           done();
        });
    })
    describe('/GET protected', () => {
        it('Normal test to see if user is logedin', (done) => {
            let user = {
                username: "lgreig212",
                password: "P4sSw0Rd!",
                score: 0
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
                            var token = res.body.token;
                            chai.request(server)
                                .get('/user/protected')
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('success').eql(true);
                                    res.body.should.have.property('msg').eql('You are successfully authenticated to this route!');
                                    done();
                                });
                        });
                });
        });
    });

    describe('/GET protected', () => {
        it('Exceptional test make sure only user with token can access this route', (done) => {
            let user = {
                username: "lgreig213",
                password: "P4sSw0Rd!",
                score: 0
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
                            chai.request(server)
                                .get('/user/protected')
                                .set('Authorization', 'noToken')
                                .end((err, res) => {
                                    res.should.have.status(401);
                                    done();
                                });
                        });
                });
        });
    });
});
