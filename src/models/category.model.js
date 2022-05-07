const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Category must include name'],
  },
  description: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Category', categorySchema);
