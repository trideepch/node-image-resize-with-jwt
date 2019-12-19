'use strict';

const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

var util = {};
util.generateAuthToken = (obj) => {
    return jwt.sign(obj, process.env.JWT_KEY);
}

util.decodeAuthToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
        console.error("Error decoding token :" + error);
        return null;
    }
}

util.validateImageExtention = (file, cb) => {
    // accept image only
    let isValidImage = false;
    try {
        if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            isValidImage = true;
        }
    } catch (error) {
        console.error("Error :" + error);
    }
    return isValidImage;
};

util.getUniqueId = () => {
    return uuidv4();
}

module.exports = util;