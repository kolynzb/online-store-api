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
    if (roles.includes(req.user.role))
      return next(new AppError('Unauthorized Access', 403));
    next();
  };

exports.protected = catchAsync(async (req, res, next) => {
  let token;
  //get token
  if (
    req.headers.authorization ||
    req.headers.authorization.startwith('Bearer ')
  ) {
    token = req.headers.Authorization.split(' ')[2];
  } else if (req.cookie.jwt) {
    token = req.cookie.jwt;
  }

  if (!token) return next(new AppError('Unauthorized access', 403));
  //verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new AppError('The user beloging to the token nolonger exists', 401)
    );

  //check if user has recently changed there password after token was issued
  //add user to request body
  req.user = currentUser;
  next();
});
