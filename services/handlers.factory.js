const asyncHandler = require("express-async-handler");
const { ApiError } = require("../utils/errorHandler");
const ApiPagination = require("../utils/apiPagination");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const model = await Model.findByIdAndDelete(id);
    if (!model) {
      return next(
        new ApiError(`${Model.modelName} not found for id: ${id}`, 404)
      );
    }

    // Trigger "remove" event launched by mongoose middleware
    // model.remove();
    res.status(204).json({ msg: `${Model.modelName} deleted successfully` });
  });

// eslint-disable-next-line default-param-last
exports.updateOne = (Model, imageFieldName = "", saveDirName = "") =>
  asyncHandler(async (req, res, next) => {
    // Update model
    const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!model) {
      return next(
        new ApiError(
          `${Model.modelName} not found for id: ${req.params.id}`,
          404
        )
      );
    }

    // Trigger for "save" event
    // model.save();

    res.status(200).json({ data: model });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const model = await Model.create(req.body);
    res.status(201).json({ data: model });
  });

exports.getOne = (Model, populateOptions = null) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Build Query
    let model = Model.findById(id);
    if (populateOptions) {
      model = model.populate(populateOptions);
    }

    // Execute Query
    model = await model;
    if (!model) {
      return next(
        new ApiError(
          `${Model.modelName} not found for id: ${req.params.id}`,
          404
        )
      );
    }
    // res stops the middleware chain
    res.status(200).json({ data: model });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    // Build Query
    const countDocuments = await Model.countDocuments();
    const apiPagination = new ApiPagination(
      Model.find(req.filterObj || {}),
      req.query
    ).paginate(countDocuments);

    // Execute Query
    const { mongooseQuery, paginationResult } = apiPagination;
    const Docs = await mongooseQuery;
    res.status(200).json({
      results: Docs.length,
      pagination: paginationResult,
      data: Docs,
    });
  });
