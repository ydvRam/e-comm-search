const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce-search");
    console.log("Db is connected");
  } catch (error) {
    console.error("Db is not connected");
    process.exit(1);
  }
}
module.exports = connectDB;