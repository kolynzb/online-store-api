const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a Name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, 'Please Provide a Valid Email'],
    },
    address: {
      type: {
        type: String,
        default: 'Point',
        enum: ['point'],
      },
      coordinates: [Number],
      address: String,
      desciption: String,
    },
    photo: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Please provide a Password'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please provide a Password Confirmation'],
      validate: {
        validator: function (el) {
          //parameter gives ue acess to the current element but this only works on save and create.
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    passwordChangedAt: Date,
    resetExpiresIn: Date,
    passwordResetToken: Number,
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

//run presave middleware to encrypt passwords
userSchema.pre('save', async function (next) {
  //only run if password is modified
  if (!this.isModified('password')) return next();
  //hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; //deleting confirm password
  next();
});

// query middleware that removes deactivated users
userSchema.pre('/^find/', async function (next) {
  //this points to the current query
  await this.find({ active: { $ne: false } });
  next();
});

//instance method checks password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //this.password is not available beacuse of the select false
  return await bcrypt.compare(candidatePassword, userPassword);
};

//password changed at or new user
userSchema.pre('save', async function (next) {
  if (!this.password.isModified || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Check if password changed after token issued
userSchema.methods.wasPasswordChanged = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedAT = parseInt(this.passwordChangedAt / 1000, 10);
    return jwtTimestamp < changedAT;
  }
  //password not changed
  return false;
};

// create password reset token
userSchema.passwordResetToken.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest();
  this.resetExpiresIn = Date.now() + 10 * 60 * 1000; // expires in 10minutes
  return resetToken;
};
