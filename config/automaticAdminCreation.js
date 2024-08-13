const UserModel = require("../models/user.model");
exports.createAdmin = async () => {
  // Check if admin exists and create one if not
  const adminExists = await UserModel.findOne({
    username: "admin",
    role: "admin",
  });
  if (!adminExists) {
    await UserModel.create({
      username: "admin",
      email: "admin@gmail.com",
      password: "admin123",
      verified: true,
      role: "admin",
    })
      .then(() => console.log("Admin created successfully by default !!"))
      .catch((err) => console.log(err));
  }
};
