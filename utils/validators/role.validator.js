const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorErrorHandling.middleware");
const RoleModel = require("../../models/role.model");

// Role Validator

exports.getRoleValidator = [
  check("id").isMongoId().withMessage("Invalid Role id format !!"),
  validatorMiddleware,
]; // Array of rules.

exports.createRoleValidator = [
  check("name").notEmpty().withMessage("Role name is required !!"),
  check("parentPermissions")
    .optional()
    .isArray()
    .withMessage("parentPermissions must be an array"),
  validatorMiddleware,
];

exports.updateRoleValidator = [
  check("id").isMongoId().withMessage("Invalid Role id format !!"),
  check("name").optional(),
  check("parentPermissions")
    .optional()
    .isArray()
    .withMessage("parentPermissions must be an array"),
  validatorMiddleware,
];

exports.deleteRoleValidator = [
  check("id").isMongoId().withMessage("Invalid Role id format !!"),
  validatorMiddleware,
];

// ParentPermissions Validator

exports.createParentPermissionValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Role id format !!")
    .custom(async (val) => {
      const role = await RoleModel.findById(val);
      if (!role) {
        throw new Error(`There is no role with id ${val}`);
      }
      return true;
    }),
  check("name").optional(),
  check("permissions")
    .optional()
    .isArray()
    .withMessage("permissions must be an array"),
  validatorMiddleware,
];

exports.getParentPermissionsValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Role id format !!")
    .custom(async (val) => {
      const role = await RoleModel.findById(val);
      if (!role) {
        throw new Error(`There is no role with id ${val}`);
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getParentPermissionValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Role id format !!")
    .custom(async (val) => {
      const role = await RoleModel.findById(val);
      if (!role) {
        throw new Error(`There is no role with id ${val}`);
      }
      return true;
    }),
  check("parentPermissionId")
    .isMongoId()
    .withMessage("Invalid parentPermission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      if (!role) {
        throw new Error(`There is no role with id ${req.params.id}`);
      }
      const parentPermission = role.parentPermissions.id(val);
      if (!parentPermission) {
        throw new Error(
          `There is no parentPermission with id ${val} in role ${req.params.id}`
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateParentPermissionValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid role id format !!")
    .custom(async (val) => {
      const Role = await RoleModel.findById(val);
      if (!Role) {
        throw new Error(`There is no Role with id ${val}`);
      }
      return true;
    }),
  check("parentPermissionId")
    .isMongoId()
    .withMessage("Invalid parentPermission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      const parentPermission = await role.parentPermissions.id(val);
      if (!parentPermission) {
        throw new Error(
          `There is no parentPermission with id ${val} in Role ${req.params.id}`
        );
      }
      return true;
    }),
  check("name").optional(),
  check("permissions")
    .optional()
    .isArray()
    .withMessage("permissions must be an array"),
  validatorMiddleware,
];

exports.deleteParentPermissionValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid role id format !!")
    .custom(async (val) => {
      const role = await RoleModel.findById(val);
      if (!role) {
        throw new Error(`There is no role with id ${val}`);
      }
      return true;
    }),
  check("parentPermissionId")
    .isMongoId()
    .withMessage("Invalid parentPermission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      if (!role) {
        throw new Error(`There is no role with id ${req.params.id}`);
      }
      const parentPermission = await role.parentPermissions.id(val);
      if (!parentPermission) {
        throw new Error(
          `There is no parentPermission with id ${val} in role ${req.params.id}`
        );
      }
      return true;
    }),
  validatorMiddleware,
];

// Permissions Validator
exports.getPermissionsValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid role id format !!")
    .custom(async (val) => {
      const role = await RoleModel.findById(val);
      if (!role) {
        throw new Error(`There is no role with id ${val}`);
      }
      return true;
    }),
  check("parentPermissionId")
    .isMongoId()
    .withMessage("Invalid parentPermission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      const parentPermission = await role.parentPermissions.id(val);
      if (!parentPermission) {
        throw new Error(
          `There is no parentPermission with id ${val} in role ${req.params.id}`
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.createPermissionValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid role id format !!")
    .custom(async (val) => {
      const role = await RoleModel.findById(val);
      if (!role) {
        throw new Error(`There is no role with id ${val}`);
      }
      return true;
    }),
  check("parentPermissionId")
    .isMongoId()
    .withMessage("Invalid parentPermission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      const parentPermission = await role.parentPermissions.id(val);
      if (!parentPermission) {
        throw new Error(
          `There is no parentPermission with id ${val} in role ${req.params.id}`
        );
      }
      return true;
    }),
  check("name").optional(),
  validatorMiddleware,
];

exports.getPermissionValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid role id format !!")
    .custom(async (val) => {
      const role = await RoleModel.findById(val);
      if (!role) {
        throw new Error(`There is no role with id ${val}`);
      }
      return true;
    }),
  check("parentPermissionId")
    .isMongoId()
    .withMessage("Invalid parentPermission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      const parentPermission = await role.parentPermissions.id(val);
      if (!parentPermission) {
        throw new Error(
          `There is no parentPermission with id ${val} in role ${req.params.id}`
        );
      }
      return true;
    }),
  check("permissionId")
    .isMongoId()
    .withMessage("Invalid permission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      const parentPermission = role.parentPermissions.id(
        req.params.parentPermissionId
      );
      const permission = parentPermission.permissions.id(val);
      if (!permission) {
        throw new Error(
          `There is no permission with id ${val} in parentPermission ${req.params.parentPermissionId} in role ${req.params.id}`
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updatePermissionValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid role id format !!")
    .custom(async (val) => {
      const role = await RoleModel.findById(val);
      if (!role) {
        throw new Error(`There is no role with id ${val}`);
      }
      return true;
    }),
  check("parentPermissionId")
    .isMongoId()
    .withMessage("Invalid parentPermission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      const parentPermission = await role.parentPermissions.id(val);
      if (!parentPermission) {
        throw new Error(
          `There is no parentPermission with id ${val} in role ${req.params.id}`
        );
      }
      return true;
    }),
  check("permissionId")
    .isMongoId()
    .withMessage("Invalid permission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      const parentPermission = role.parentPermissions.id(
        req.params.parentPermissionId
      );
      const permission = await parentPermission.permissions.id(val);
      if (!permission) {
        throw new Error(
          `There is no permission with id ${val} in parentPermission ${req.params.parentPermissionId} in role ${req.params.id}`
        );
      }
      return true;
    }),
  check("name").optional(),
  validatorMiddleware,
];

exports.deletePermissionValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid role id format !!")
    .custom(async (val) => {
      const role = await RoleModel.findById(val);
      if (!role) {
        throw new Error(`There is no role with id ${val}`);
      }
      return true;
    }),

  check("parentPermissionId")
    .isMongoId()
    .withMessage("Invalid parentPermission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      const parentPermission = role.parentPermissions.id(val);
      if (!parentPermission) {
        throw new Error(
          `There is no parentPermission with id ${val} in role ${req.params.id}`
        );
      }
      return true;
    }),

  check("permissionId")
    .isMongoId()
    .withMessage("Invalid permission id format !!")
    .custom(async (val, { req }) => {
      const role = await RoleModel.findById(req.params.id);
      const parentPermission = role.parentPermissions.id(
        req.params.parentPermissionId
      );
      const permission = parentPermission.permissions.id(val);
      if (!permission) {
        throw new Error(
          `There is no permission with id ${val} in parentPermission ${req.params.parentPermissionId} in role ${req.params.id}`
        );
      }
      return true;
    }),

  validatorMiddleware,
];
