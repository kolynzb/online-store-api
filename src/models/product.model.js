const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product Name Is Required'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
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
    unitPrice: {
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
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.index({ unitPrice: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
// productSchema.index({ startLocation: '2dsphere' });

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

productSchema.virtual('selling_price').get(function () {
  return this.unitPrice - this.unitPrice * this.discount.value;
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'categories',
    select: '-__v ',
  });

  next();
});

module.exports = mongoose.model('Product', productSchema);
