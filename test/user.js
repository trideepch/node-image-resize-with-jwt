'use strict';
process.env.NODE_ENV = 'test';
process.env.MONGODB_URL = 'mongodb://localhost/nodejsauth';
process.env.JWT_KEY = 'TestDec2019';
process.env.PORT = 5000;
process.env.IMAGES_PATH = 'uploads/fullsize/';
process.env.IMAGES_THUMB_PATH = 'uploads/thumbs/'

let mongoose = require("mongoose");
require("../db/db")
let User = require('../models/user.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);

describe('Users', () => {
    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/api/v1/users/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.result.should.be.a('array');
                    res.body.result.length.should.be.above(0);
                    done();
                });
        });
    });

    /**
     * Test the /POST route - register
     */
    describe('/POST users', () => {
        it('it will register a user', (done) => {
            let user_reg = {
                name: Date.now().toString(),
                email: Date.now().toString() + "@gmail.com",
                password: "12345"
            }
            chai.request(server)
                .post('/api/v1/users/')
                .send(user_reg)
                .end((err, res) => {
                    console.log(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    done();
                });
        });
    });

    // positive login
    describe('/POST users/login', () => {
        it('it will login to the system', (done) => {
            let user = {
                "email": "t4@c.com",
                "password": "12345"
            };
            chai.request(server)
                .post('/api/v1/users/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    // negative login incorrect email
    describe('/POST users/login', () => {
        it('it will login to the system', (done) => {
            let user = {
                "email": "b@c.com",
                "password": "12345"
            };
            chai.request(server)
                .post('/api/v1/users/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    // negative login incorrect email
    describe('/POST users/login', () => {
        it('it will login to the system', (done) => {
            let user = {
                "email": "t4@c.com",
                "password": "124523232"
            };
            chai.request(server)
                .post('/api/v1/users/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
});
