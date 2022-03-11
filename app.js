const express = require('express');
require('dotenv').config();

const app = express();
const userRoute = require('./routes/user.routes');

//api routes
app.get('/', (req, res) => res.send('hello world'));
app.use('/users', userRoute);

module.exports = app;
