const express = require('express');
require('dotenv').config();

const app = express();
const userRoute = require('./routes/user.routes');
const globalErrorHandler = require('./middleware/errorHandler.middleware');

//api routes
app.use('/users', userRoute);

//global error handling
app.all('*', globalErrorHandler);
module.exports = app;
