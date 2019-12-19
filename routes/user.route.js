'use strict';
const auth = require("../middleware/auth");
const User = require("../models/user.model");
const Util = require("../utils/util");
const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();

router.post("/", async(req, res) => {
    //find an existing user
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ "error": "User already registered.", "status": 400 });

    user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    });
    await user.save();
    res.send({
        status: 200,
        msg: "User registered",
        result: {
            "_id": user._id,
            "name": user.name,
            "email": user.email
        }
    });
});


router.post("/login", async(req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        let result = {};
        let status = 200;
        if (!err && user) {
            // We could compare passwords in our model instead of below
            bcrypt.compare(password, user.password).then(match => {
                if (match) {
                    // Create a token
                    const token = Util.generateAuthToken({ _id: user._id });
                    result.token = token;
                    result.status = status;
                    result.result = user;

                } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                }
                res.status(status).send(result);
            }).catch(err => {
                console.log(err);
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            });
        } else {
            status = 404;
            result.status = status;
            result.error = err;
            result.msg = "User Not Found";
            res.status(status).send(result);
        }
    });
});

router.get("/all", async(req, res) => {
    try {
        const users = await User.find();
        res.send({ status: 200, error: null, result: users });
    } catch (err) {
        res.status(500).send({ error: err, status: 500 });
    }

});

module.exports = router;