const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a Name'],
  },
  email: {
    type: String,
    // required: [true, 'Please provide an email'],
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    // required: [true, 'Please provide a Password'],
  },
  passwordConfirm: {
    type: String,
    // required: [true, 'Please provide a Password Confirmation'],
  },
});

module.exports = mongoose.model('User', userSchema);
