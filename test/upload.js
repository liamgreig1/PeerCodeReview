//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../api/models/userModel');
let Code = require('../api/models/codeModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { describe } = require("mocha");
let should = chai.should();

chai.use(chaiHttp);

describe('Upload', () => {
    beforeEach((done) => { //Before each test we empty the database
        
        Code.deleteMany({}, (err) => {
            User.deleteMany({}, (err) => {
                done();
            });
        }); 
    });
        describe('/POST upload', () => {
            it('should test normal upload', (done) => {
                let user = {
                    username: "lgreig200",
                    password: "P4sSw0Rd!",
                    score: 0
                }
                let user1 = {
                    username: "lclyne200",
                    password: "P4sSw0Rd!",
                    score: 0
                }
                let code = {
                        filename: "HelloWorld.java",
                        filesize: 117,
                        content: "class HelloWorld {public static void main(String[] args) {System.out.println(\"Hello, World!\"); }}",
                        author: "lgreig200",
                        reviewer: "lclyne200",
                        status: false
                }
                chai.request(server)
                .post('/user/register')
                .send(user)
                .end((err, res) => {
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        chai.request(server)
                            .post('/user/register')
                            .send(user1)
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
                                            .post('/code/upload')
                                            .set('Authorization', token)
                                            .send(code)
                                            .end((err, res) => {
                                                res.body.should.be.a('object');
                                                res.body.should.have.property('success').eql(true);
                                                Code.deleteMany({}, (err) => {
                                                    User.deleteMany({}, (err) => {
                                                    });
                                                }); 
                                                done();
                                            });
                                    });
                });
            });
            
        });

    });
});