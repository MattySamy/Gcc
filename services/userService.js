/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-extraneous-dependencies */

const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");

const { ApiError } = require("../utils/errorHandler");
const UserModel = require("../models/user.model");
const factory = require("./handlers.factory");

// Middleware for filtering users only
exports.filterRoles = (role) =>
  asyncHandler(async (req, res, next) => {
    let filterObj = {};
    if (req.user.role === "admin") {
      filterObj = { role: role };
      req.filterObj = filterObj;
    }
    next();
  });

// Middleware for filtering admins only
exports.updateOnlyAdmin = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  if (user.role !== "admin") {
    return next(
      new ApiError("You are not authorized to perform this action", 403)
    );
  }
  next();
});

// @desc Get all users
// @route GET /api/v1/users
// @access Private/Admin

exports.getUsers = factory.getAll(UserModel);

// @desc Get all admins
// @route GET /api/v1/users/admins
// @access Private/Admin

exports.getAdmins = factory.getAll(UserModel);

// @desc Get single user by id
// @route GET /api/v1/users/:id
// @access Private/Admin

exports.getUser = factory.getOne(UserModel);

// @desc Update specific admin
// @route PUT /api/v1/users/admins/:id
// @access Private/Admin

exports.updateAdmin = factory.updateOne(UserModel);

// // @desc Update specific user
// // @route PUT /api/v1/users/:id
// // @access Private/Admin

// exports.updateUser = factory.updateOne(UserModel);

// Change User Password Middleware
// @desc Update specific user password
// @route PUT /api/v1/users/changePassword/:id
// @access Private

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const modelExists = await UserModel.findById(req.params.id);
  const model = await UserModel.findByIdAndUpdate(req.params.id, {
    password: req.body.password
      ? await bcrypt.hash(req.body.password, 12)
      : modelExists.password,
    passwordChangedAt: Date.now(),
  });

  if (req.cookies.jwt) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.jwt;

    // Deleting refreshToken from cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  }
  if (!model) {
    return next(
      new ApiError(
        `${UserModel.modelName} not found for id: ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ data: model });
});

// @desc Delete specific user
// @route DELETE /api/v1/users/:id
// @access Private

exports.deleteUser = factory.deleteOne(UserModel);

// @desc Create new user
// @route POST /api/v1/users
// @access Private

exports.createUser = factory.createOne(UserModel);
