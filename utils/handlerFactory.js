const catchAsync = require('./catchAsync');
const APIFeatures = require('./apiFeatures');
const AppError = require('./appError');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({ status: 'success', data: { data: doc } });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const filterObj = {};

    const features = new APIFeatures(Model.find(filterObj), req.query)
      .filter()
      .limitFields()
      .sort()
      .paginate();

    const docs = await features.dbQuery;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { docs },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc)
      return next(
        new AppError(`No Document with Id of ${req.params.id} found`, 404)
      );

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc)
      return next(
        new AppError(`No Document with Id of ${req.params.id} found`, 404)
      );

    res.status(200).json({
      status: 'success',
      message: 'Document successfully updated',
      data: { doc },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(
        new AppError(`No Document with Id of ${req.params.id} found`, 404)
      );

    res.status(200).json({
      status: 'success',
      message: 'Document  deleted successfully',
      data: { doc },
    });
  });
