const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const app = express();
const userRoute = require('./routes/user.routes');
const globalErrorHandler = require('./middleware/errorHandler.middleware');
const AppError = require('./utils/appError');

app.use(express.json());
app.use(cookieParser());

// Set security HTTP headers
app.use(helmet());

//api routes
app.use('/api/v1/user', userRoute);

//global error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
