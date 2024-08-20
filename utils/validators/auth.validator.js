/* eslint-disable import/no-extraneous-dependencies */
const { check } = require("express-validator");
const { phone } = require("phone");

const validatorMiddleware = require("../../middlewares/validatorErrorHandling.middleware");
const UserModel = require("../../models/user.model");
const CountryModel = require("../../models/Country");

exports.signUpValidator = [
  check("country")
    .notEmpty()
    .withMessage("Country is required !!")
    .custom(async (val) => {
      const country = await CountryModel.findOne({ name: val });
      if (!country) {
        throw new Error(`There is no country with name ${val}`);
      }
      return true;
    }),
  check("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short User username !!"),
  check("email")
    .notEmpty()
    .withMessage("User email is required !!")
    .isEmail({
      host_whitelist: ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"],
    })
    .withMessage(
      "Invalid email format, Only Gmail, Yahoo, Outlook and Hotmail emails are allowed !!"
    )
    .custom((value) =>
      UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists !!"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("User password is required !!")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 3,
      minSymbols: 1,
    })
    .withMessage(
      "Password is too week and should be at least 6 characters consists of uppercase, lowercase, numbers and symbols !!"
    )
    .isLength({ min: 6 })
    .withMessage("Too short User password !!"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Confirm password is required !!")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match !!");
      }
      return true;
    }),
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required !!")
    .custom(async (value, { req }) => {
      const country = await CountryModel.findOne({ name: req.body.country });
      if (!country) {
        throw new Error(`Invalid country ${req.body.country} !!`);
      }
      if (value.startsWith(country.code)) {
        value = value.replace(country.code, "");
      }
      const phoneValid = phone(value, {
        country: country.tag,
      });
      if (!phoneValid.isValid) {
        throw new Error(`Invalid phone number ${value} !!`);
      }
      if (
        phoneValid.countryCode !==
        (await CountryModel.findOne({ name: req.body.country })).code
      ) {
        throw new Error(`Invalid ${country.name} Code !!`);
      }
      if (
        phoneValid.countryIso2 !==
        (await CountryModel.findOne({ name: req.body.country })).tag
      ) {
        throw new Error(`Invalid ${country.name} Tag ${country.tag} !!`);
      }
      return true;
    }),
  check("firstName")
    .notEmpty()
    .withMessage("First name is required !!")
    .custom((value) => {
      // make if statement for first name if has special characters or numbers then return error
      if (!value.match(/^[a-zA-Z]+$/)) {
        const numberCheck = value.match(/[0-9]/g);
        const specialCheck = value.match(
          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g
        );
        throw new Error(
          `Invalid first name because it has ${
            numberCheck
              ? "numbers"
              : specialCheck
              ? "special characters"
              : "other characters"
          } !!`
        );
      }
      return true;
    }),
  check("lastName")
    .notEmpty()
    .withMessage("Last name is required !!")
    .custom((value) => {
      // make if statement for first name if has special characters or numbers then return error
      if (!value.match(/^[a-zA-Z]+$/)) {
        const numberCheck = value.match(/[0-9]/g);
        const specialCheck = value.match(
          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g
        );
        throw new Error(
          `Invalid last name because it has ${
            numberCheck
              ? "numbers"
              : specialCheck
              ? "special characters"
              : "other characters"
          } !!`
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.logInValidator = [
  check("username")
    .notEmpty()
    .withMessage("User username or email is required !!"),
  check("password").notEmpty().withMessage("User password is required !!"),

  validatorMiddleware,
];
