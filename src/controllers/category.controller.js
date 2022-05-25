const Category = require('../models/category.model');
// const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/handlerFactory.util');

exports.createCategory = factory.createOne(Category);
exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
