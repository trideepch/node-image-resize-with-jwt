'use strict';
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const logger = require('morgan');
require("./db/db")

const environment = process.env.NODE_ENV; // development
if (environment !== 'production') {
    app.use(logger('combined'));
}


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//use env var JWT_KEY to check it exists, if no JWT_KEY set, end the application
if (!process.env.JWT_KEY) {
    console.error("FATAL ERROR: JWT_KEY is not defined.");
    process.exit(1);
}

app.use(require('./routes'));
var router = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1', router);


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ status: 500, error: 'Something broke!' });
});

process.on('unhandledRejection', (error, promise) => {
    console.error('unhandledRejection', error.message);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}... http://localhost:${port}/api/v1`));

module.exports = app;