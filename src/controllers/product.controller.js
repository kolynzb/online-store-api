const Product = require('../models/product.model');
// const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/handlerFactory');

exports.createProduct = factory.createOne(Product);
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
