const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
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
      required: [true, "Phone number is required"],
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetVerifiedMode: Boolean,
    passwordResetCode: String,
    passwordResetExpires: Date,
    verified: { type: Boolean, default: false },
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

module.exports = mongoose.model("User", userSchema);
