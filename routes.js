'use strict';
var express = require('express');
var router = express.Router();

// REGISTER ROUTES -------------------------------
// all routes should be prefixed with /api/v1

const usersRoute = require("./routes/user.route");
router.use("/api/v1/users", usersRoute);

const imgRoute = require("./routes/image.route");
router.use("/api/v1/images", imgRoute);


module.exports = router;