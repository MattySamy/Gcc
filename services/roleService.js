const asyncHandler = require("express-async-handler");

const Role = require("../models/role.model");
const RoleIterator = require("../utils/roleIterator");
const { ApiError } = require("../utils/errorHandler");
const factory = require("./handlers.factory");

// Roles

// @desc Get all roles
// @route GET /api/v1/roles
// @access Private/Admin

exports.getRoles = factory.getAll(Role);

// @desc Get single role by id
// @route GET /api/v1/roles/:id
// @access Private/Admin

exports.getRole = factory.getOne(Role);

// @desc Create role
// @route POST /api/v1/roles
// @access Private/Admin

exports.createRole = factory.createOne(Role);

// @desc Update Role
// @route PUT /api/v1/roles/:id
// @access Private/Admin

exports.updateRole = factory.updateOne(Role);

// @desc Delete Role
// @route DELETE /api/v1/roles/:id
// @access Private/Admin

exports.deleteRole = factory.deleteOne(Role);

// @desc Get parent permissions
// @route GET /api/v1/roles/:id/level2
// @access Private/Admin

exports.getParentPermissions = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(new ApiError(`Role not found for id: ${req.params.id}`, 404));
  }

  const iterator = new RoleIterator(role);
  const parentPermissions = iterator.getParentPermissions();
  res.status(200).json({ data: parentPermissions });
});

// @desc Get permissions
// @route GET /api/v1/roles/:id/level2/:parentPermissionId/level3
// @access Private/Admin

exports.getPermissions = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    return next(new ApiError(`Role not found for id: ${req.params.id}`, 404));
  }

  const parentPermission = await role.parentPermissions.id(
    req.params.parentPermissionId
  );

  if (!parentPermission) {
    return next(
      new ApiError(
        `ParentPermission not found for id: ${req.params.parentPermissionId}`,
        404
      )
    );
  }

  const iterator = new RoleIterator(role);
  const permissions = iterator.getPermissions();

  res.status(200).json({ data: permissions });
});

// @desc Create parentpermissions
// @route POST /api/v1/roles/:id/level2
// @access Private/Admin

exports.createParentPermissions = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(new ApiError(`Role not found for id: ${req.params.id}`, 404));
  }

  const createdParentPermission = await role.parentPermissions.push(req.body);
  await role.save();

  res.status(200).json({
    msg: "ParentPermission created successfully",
    data: role.parentPermissions,
  });
});

// @desc Update parentpermission
// @route PUT /api/v1/roles/:id/level2/:parentPermissionId
// @access Private/Admin

exports.updateParentPermission = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    return next(new ApiError(`Role not found for id: ${req.params.id}`, 404));
  }

  const parentPermission = await role.parentPermissions.id(
    req.params.parentPermissionId
  );
  if (!parentPermission) {
    return next(
      new ApiError(
        `ParentPermission not found for id: ${req.params.parentPermissionId}`,
        404
      )
    );
  }

  parentPermission.set(req.body);

  await role.save();

  res.status(200).json({
    msg: "ParentPermission updated successfully",
    data: parentPermission,
  });
});

// @desc Delete parentpermission
// @route DELETE /api/v1/roles/:id/level2/:parentPermissionId
// @access Private/Admin

exports.deleteParentPermission = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    return next(new ApiError(`Role not found for id: ${req.params.id}`, 404));
  }

  const parentPermission = await role.parentPermissions.id(
    req.params.parentPermissionId
  );
  if (!parentPermission) {
    return next(
      new ApiError(
        `ParentPermission not found for id: ${req.params.parentPermissionId}`,
        404
      )
    );
  }

  const deletedParentPermission = await role.parentPermissions
    .id(req.params.parentPermissionId)
    .deleteOne();

  await role.save();

  res.status(204).json({ data: parentPermission });
});

// Permissions

// @desc Create Permissions
// @route POST /api/v1/roles/:id/level2/:parentPermissionId/level3
// @access Private/Admin

exports.createPermissions = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(new ApiError(`Role not found for id: ${req.params.id}`, 404));
  }

  const parentPermission = await role.parentPermissions.id(
    req.params.parentPermissionId
  );

  if (!parentPermission) {
    return next(
      new ApiError(
        `ParentPermission not found for id: ${req.params.parentPermissionId}`,
        404
      )
    );
  }

  const createdPermission = await parentPermission.permissions.push(req.body);

  await role.save();
  await parentPermission.save();

  res.status(200).json({
    msg: "Permission created successfully",
    data: role.parentPermissions,
  });
});

// @desc Update Permissions
// @route PUT /api/v1/roles/:id/level2/:parentPermissionId/level3/:permissionId
// @access Private/Admin

exports.updatePermission = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    return next(new ApiError(`Role not found for id: ${req.params.id}`, 404));
  }

  const parentPermission = await role.parentPermissions.id(
    req.params.parentPermissionId
  );
  if (!parentPermission) {
    return next(
      new ApiError(
        `ParentPermission not found for id: ${req.params.parentPermissionId}`,
        404
      )
    );
  }

  const permission = await parentPermission.permissions.id(
    req.params.permissionId
  );
  if (!permission) {
    return next(
      new ApiError(
        `Permission not found for id: ${req.params.permissionId}`,
        404
      )
    );
  }

  await permission.set(req.body);

  await parentPermission.save();
  await role.save();

  res
    .status(200)
    .json({ msg: "Permission updated successfully", data: parentPermission });
});

// @desc Delete Permissions
// @route DELETE /api/v1/roles/:id/level2/:parentPermissionId/level3/:permissionId
// @access Private/Admin

exports.deletePermission = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  if (!Role) {
    return next(new ApiError(`Role not found for id: ${req.params.id}`, 404));
  }

  const parentPermission = await role.parentPermissions.id(
    req.params.parentPermissionId
  );
  if (!parentPermission) {
    return next(
      new ApiError(
        `parentPermission not found for id: ${req.params.parentPermissionId}`,
        404
      )
    );
  }

  const permission = await parentPermission.permissions.id(
    req.params.permissionId
  );
  if (!permission) {
    return next(
      new ApiError(
        `Permission not found for id: ${req.params.permissionId}`,
        404
      )
    );
  }

  const deletedPermission = await permission.deleteOne();

  await parentPermission.save();
  await role.save();

  res.status(204).json({ data: permission });
});
