const mongoose = require("mongoose");
require("dotenv").config();

const { NODE_ENV, DB_PROD, DB_LOCAL, DB_TEST, DB_DEV } = process.env;

let DB_URI = "";

switch (NODE_ENV) {
  case "development":
    DB_URI = DB_DEV;
    break;
  case "test":
    DB_URI = DB_TEST;
    break;
  case "development":
    DB_URI = DB_PROD;
    break;
  default:
    DB_URI = DB_LOCAL;
    break;
}

NODE_ENV === "production" ? DB_PROD : DB_LOCAL;

const connectDB = async () => {
  await mongoose
    .connect(DB_URI)
    .then(() => console.log("Connected successfully"))
    .catch((err) => console.log("Error connecting", err));
};

module.exports = connectDB;
