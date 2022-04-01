const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { createSendToken } = require('../middleware/token.middleware');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  //TODO: user exists
  if (!newUser) return next(new AppError('Something went wrong', 403));

  const url = `$req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please Provide an email and password!', 400));

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || (await User.checkpassword(password, user.password)))
    return next(new AppError('Incorrect Email or Password'), 401);
  createSendToken(user, 201, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ status: 'success', message: 'Successfully Logged Out' });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on posted email
  //generate the random reset token
  //send it to the user email
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on the token
  //if the token has not expired and there is user , ser the new password
  //log user in and send jwt
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  //get user from collection
  //check if posted current password is correct
  //update password
  //log user in send jwt
});
