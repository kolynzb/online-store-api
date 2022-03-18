const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { createSendToken } = require('../middleware/token.middleware');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  //TODO: user exists
  const url = `$req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please Provide an email and password!', 400));

  const user = await User.findOne({ email: email }).select('+password');

  if (!user) return next(new AppError('User doesnt exist!', 400));

  //TODO:check password

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
