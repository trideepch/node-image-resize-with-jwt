'use strict';
process.env.NODE_ENV = 'test';
process.env.MONGODB_URL = 'mongodb://localhost/nodejsauth';
process.env.JWT_KEY = 'TestDec2019';
process.env.PORT = 5000;
process.env.IMAGES_PATH = 'uploads/fullsize/';
process.env.IMAGES_THUMB_PATH = 'uploads/thumbs/'
process.env.SlEEP = 0;

let mongoose = require("mongoose");
require("../db/db")
let Image = require('../models/image.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let fs = require('fs');


chai.use(chaiHttp);

describe('Images', () => {
    describe('/GET images', () => {
        it('it should GET all the images by user', (done) => {
            chai.request(server)
                .get('/api/v1/images/all')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGY4YWY4NTk0NTMyZjZjMTc3ZTI2ZWEiLCJpYXQiOjE1NzY2Mzk3OTZ9.Vh9R36m-Sn9mQNMiaG8etvasQSQH898yqcGfkSBmrXQ')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.result.should.be.a('array');
                    res.body.result.length.should.be.above(0);
                    done();
                });
        });
    });

    // positive test
    describe('/POST images/upload', () => {
        it('It will upload an image for a user', (done) => {
            chai.request(server)
                .post('/api/v1/images/upload')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGY4YWY4NTk0NTMyZjZjMTc3ZTI2ZWEiLCJpYXQiOjE1NzY2Mzk3OTZ9.Vh9R36m-Sn9mQNMiaG8etvasQSQH898yqcGfkSBmrXQ')
                .attach('img', fs.readFileSync('/Users/tric/Desktop/a.png'), 'a.png')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg');
                    res.body.result.should.be.a('object');
                    // res.body.result.length.should.be.above(0);
                    done();
                });
        });
    });

    // negative test
    describe('/POST images/upload', () => {
        it('It will upload an image for a user', (done) => {
            chai.request(server)
                .post('/api/v1/images/upload')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .attach('img', fs.readFileSync('/Users/tric/Desktop/a.png'), 'a.png')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
});