const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'This Product Id is a required Field'],
    },
  ],
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
