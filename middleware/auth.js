'use strict';
const jwt = require("jsonwebtoken");
const Util = require("../utils/util");

module.exports = (req, res, next) => {
    //get the token from the header if present
    let token = "";
    if (req.headers["authorization"]) {
        token = req.headers["authorization"].split(' ')[1];
    }
    //if no token found, return response (without going to the next middelware)
    if (!token) return res.status(401).send({ error: "Access denied. No token provided.", status: 401 });

    try {
        // verify the token, set req.user and pass to next middleware
        const decoded = Util.decodeAuthToken(token);
        req.user = decoded;
        next();
    } catch (ex) {
        //if invalid token
        res.status(400).send({ "error": "Invalid token." });
    }
};