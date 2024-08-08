const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: String,
  parentPermissions: [
    new mongoose.Schema({
      name: String,
      permissions: [
        new mongoose.Schema({
          name: String,
        }),
      ],
    }),
  ],
});

module.exports = mongoose.model("Role", roleSchema);
