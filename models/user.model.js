const mongoose = require("mongoose");
const { phone } = require("phone");
const bcrypt = require("bcrypt");

const CountryModel = require("./country.model");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetVerifiedMode: Boolean,
    passwordResetCode: String,
    passwordResetExpires: Date,
    verified: { type: Boolean, default: false },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password on create
  const salt = await bcrypt.hash(this.password, 12);
  this.password = salt;
  next();
});

userSchema.post("validate", async (doc) => {
  const country = await CountryModel.findOne({
    name: doc.country,
  }).select("code tag");

  if (!country) {
    throw new Error("Invalid country !!");
  }

  // Remove the country code if it exists in the phone number
  if (doc.phone.startsWith(country.code)) {
    doc.phone = doc.phone.replace(country.code, "");
  }

  // Rebuild the phone number with the country code
  const fullPhoneNumber = doc.phone;

  // Validate the phone number using the phone package
  const phoneValid = phone(fullPhoneNumber, {
    country: country.tag, // Use country tag for validation (e.g., "EG" for Egypt)
  });

  // Check if the phone number is valid
  if (!phoneValid.isValid) {
    throw new Error(`Invalid phone number ${fullPhoneNumber} !!`);
  }

  // Validate that the country code from the phone number matches the country's code
  if (phoneValid.countryCode !== country.code) {
    throw new Error(`Invalid ${country.name} Code !!`);
  }

  // Validate that the country tag matches
  if (phoneValid.countryIso2 !== country.tag) {
    throw new Error(`Invalid ${country.name} Tag !!`);
  }

  // Update the phone number on the document with the valid formatted number
  doc.phone = phoneValid.phoneNumber;
  if (!doc.username) {
    doc.username = doc.firstName + doc.lastName;
    const user = await mongoose.model("User").findOne({
      username: doc.username,
    });
    if (user) {
      doc.username = doc.username + Math.floor(Math.random() * 100000);
    }
  }
  return doc;
});

module.exports = mongoose.model("User", userSchema);
