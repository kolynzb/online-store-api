const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product Name Is Required'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      minlength: [5, 'Descriptions Should  Be Atleast 5 Characters'],
      required: [true, 'Product Description Is Required'],
    },
    price: {
      value: { type: Number, required: [true, 'Product Price Is Required'] },
      currency: {
        type: String,
        uppercase: true,
        required: [true, 'Currency Of Product Price Is Required'],
        default: 'UGX',
      },
    },
    discount: {
      value: { type: Number, default: 0 },
      description: String,
    },
    images: {
      previewImage: String,
      others: [String],
    },
    colors: [String],
    sizes: [
      {
        type: String,
        uppercase: true,
        enum: {
          values: ['XS', 'S', 'M', 'XL', '2XL', '3XL'],
          message: 'Sizes must either be XS , S, M, XL, 2XL, 3XL',
        },
      },
    ],
    categories: [{ type: mongoose.Schema.ObjectId, ref: 'Category' }],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// TODO: Add virtual schema for new price after discount
// TODO: Populate categories
module.exports = mongoose.model('Product', productSchema);
