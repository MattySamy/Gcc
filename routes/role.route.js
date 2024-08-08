const express = require("express");
// const categoryValidator = require("../utils/validators/category.validator");
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getParentPermissions,
  createParentPermissions,
  updateParentPermission,
  deleteParentPermission,
  getPermissions,
  createPermissions,
  updatePermission,
  deletePermission,
} = require("../services/roleService");

const AuthorizedService = require("../services/authService");

const router = express.Router();

// Global Authorization Middleware

router.use(AuthorizedService.authProtect, AuthorizedService.allowedTo("admin"));

// Roles Routes

router.route("/").post(createRole).get(getRoles);

router.route("/:id").get(getRole).put(updateRole).delete(deleteRole);

// Parent Permissions Routes

router
  .route("/:id/level2")
  .get(getParentPermissions)
  .post(createParentPermissions);

router
  .route("/:id/level2/:parentPermissionId")
  .put(updateParentPermission)
  .delete(deleteParentPermission);

// Sub SubCategories Routes

router
  .route("/:id/level2/:parentPermissionId/level3")
  .get(getPermissions)
  .post(createPermissions);

router
  .route("/:id/level2/:parentPermissionId/level3/:permissionId")
  .put(updatePermission)
  .delete(deletePermission);

module.exports = { router };
