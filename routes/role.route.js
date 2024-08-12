const express = require("express");
const roleValidator = require("../utils/validators/role.validator");
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getParentPermissions,
  getParentPermission,
  createParentPermissions,
  updateParentPermission,
  deleteParentPermission,
  getPermissions,
  getPermission,
  createPermissions,
  updatePermission,
  deletePermission,
} = require("../services/roleService");

const AuthorizedService = require("../services/authService");

const router = express.Router();

// Global Authorization Middleware

router.use(AuthorizedService.authProtect, AuthorizedService.allowedTo("admin"));

// Roles Routes

router
  .route("/")
  .post(...roleValidator.createRoleValidator, createRole)
  .get(getRoles);

router
  .route("/:id")
  .get(...roleValidator.getRoleValidator, getRole)
  .put(...roleValidator.updateRoleValidator, updateRole)
  .delete(...roleValidator.deleteRoleValidator, deleteRole);

// Parent Permissions Routes

router
  .route("/:id/level2")
  .get(...roleValidator.getParentPermissionsValidator, getParentPermissions)
  .post(
    ...roleValidator.createParentPermissionValidator,
    createParentPermissions
  );

router
  .route("/:id/level2/:parentPermissionId")
  .get(...roleValidator.getParentPermissionValidator, getParentPermission)
  .put(...roleValidator.updateParentPermissionValidator, updateParentPermission)
  .delete(
    ...roleValidator.deleteParentPermissionValidator,
    deleteParentPermission
  );

// Permissions Routes

router
  .route("/:id/level2/:parentPermissionId/level3")
  .get(...roleValidator.getPermissionsValidator, getPermissions)
  .post(...roleValidator.createPermissionValidator, createPermissions);

router
  .route("/:id/level2/:parentPermissionId/level3/:permissionId")
  .get(...roleValidator.getPermissionValidator, getPermission)
  .put(...roleValidator.updatePermissionValidator, updatePermission)
  .delete(...roleValidator.deletePermissionValidator, deletePermission);

module.exports = { router };
