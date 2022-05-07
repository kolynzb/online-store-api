/*TODO:
 *verification emails
 *two factor auth
 * Oauth - google
 */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.restrictedTo =
  (...roles) =>
  (req, res, next) => {
    if (req.user && !roles.includes(req.user.role))
      return next(new AppError('Unauthorized Access To Resource', 403));
    next();
  };

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //get token

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization ||
    req.headers.authorization.startWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[2];
  }

  if (!token) return next(new AppError('Unauthorized Please Login', 403));
  //verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new AppError('The user beloging to the token nolonger exists', 401)
    );

  // check if user has recently changed there password after token was issued
  if (currentUser.wasPasswordChanged(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // add user to request body
  req.user = currentUser;
  next();
});
