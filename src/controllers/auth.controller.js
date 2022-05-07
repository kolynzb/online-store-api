const crypto = require('crypto');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { createSendToken } = require('../middleware/token.middleware');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  if (!newUser) return next(new AppError('Something went wrong', 403));

  const url = `$req.protocol}://${req.get('host')}/me`;
  try {
    await new Email(newUser, url).sendWelcome();
  } catch (err) {
    return next(new AppError('Something went wrong while sending Email', 500));
  }
  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please Provide an email and password!', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user && !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect Email or Password', 401));

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
  const { email } = req.body;
  //get user based on posted email
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new AppError(`No User exits with email address ${email} 💀`, 404)
    );
  //generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: true });

  //send user email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    await user.save({ validateBeforeSave: true });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetTokenExpiresIn: { $gt: Date.now() },
    passwordResetToken: hashedToken,
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) return next(new AppError('Token has Expired', 400));
  // 3) Update changedPasswordAt property for the user
  user.passwordChangedAt = Date.now();
  await user.save();
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select('+password');
  // 2) Check if POSTed current password is correct
  if (await user.correctPassword(req.body.passwordCurrent, user.password))
    return next(new AppError('Password is Wrong', 401));

  // 3) If so, update password
  user.password = req.body.passwordCurrent;
  user.passwordConfirm = req.body.passwordConfirm;
  user.save();
  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});
