const express = require("express");
// const userValidator = require("../utils/validators/user.validator");
const {
  getUsers,
  getAdmins,
  createUser,
  getUser,
  updateAdmin,
  deleteUser,
  changeUserPassword,
  filterRoles,
  updateOnlyAdmin,
} = require("../services/userService");

const AuthorizedService = require("../services/authService");

const router = express.Router();

// Admin (Users) Routes

router.use(AuthorizedService.authProtect);

router.use(AuthorizedService.allowedTo("admin"));

router.get("/", filterRoles("user"), getUsers);

router.get("/admins", filterRoles("admin"), getAdmins);

router.get("/:id", getUser).delete("/:id", deleteUser);

router.post("/admins", createUser);

router.put("/admins/:id", updateOnlyAdmin, updateAdmin);

router.put("/changePassword/:id", changeUserPassword);

module.exports = { router };
