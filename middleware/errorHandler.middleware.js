const AppError = require('../utils/appError');

const { NODE_ENV } = process.env;

//handle invalid db ids
const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path} : ${err.value}`, 400);

const handleDuplicateErrorDB = (err) => {
  //regex to find the value in quotes
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  return new AppError(`Duplicate field value of ${value}`, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  //handling invalid input data
  return new AppError(`invalid input data. ${errors.join('. ')}`, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token please login again', 400);

const handleJWTExpiredError = () =>
  new AppError('Token has expired please login again', 400);

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  if (err.IsOperational) {
    res.status(500).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //programming errors should not leak details
    console.error('Error 💥💥', err);

    res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (NODE_ENV === 'production') {
    let error = { err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrProd(err, res);
  } else if (NODE_ENV === 'development') {
    sendErrDev(err, res);
  }
};
