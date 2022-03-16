const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a Name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a Name'],
    
  },
  address: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);
