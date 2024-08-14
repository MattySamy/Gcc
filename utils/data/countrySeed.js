const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
require("colors");

const { mongoConnect } = require("../../config/mongoConnection");

const CountryModel = require("../../models/country.model");

const countrySeedData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "country.json"))
);

dotenv.config({ path: "../../config.env" });
mongoConnect(process.env.DB_URI);

const insertData = async () => {
  try {
    await CountryModel.create(countrySeedData);
    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const destroyData = async () => {
  try {
    await CountryModel.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
