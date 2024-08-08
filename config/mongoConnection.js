const mongoose = require("mongoose");

require("dotenv").config({ path: "./config.env" });

const MONGO_URI = process.env.DB_URI;

mongoose.connection.once("open", () => {
  console.log("Connection is successful !!");
});

mongoose.connection.on("error", (err) => {
  console.error(
    `There's an error occurred on connection to mongoDB: ${err} !!`
  );
});

async function mongoConnect() {
  return await mongoose.connect(MONGO_URI);
}

// For Testing with Jest
async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
