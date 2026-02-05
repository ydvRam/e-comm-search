const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce-search";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Db is connected");
  } catch (error) {
    console.error("Db is not connected:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;