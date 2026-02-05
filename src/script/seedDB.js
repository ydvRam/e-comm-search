const mongoose = require("mongoose");
const Product = require("../models/product");
const products = require("../data/products.json"); 

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce-search");

async function seed() {
  try {
    console.log("⏳ Seeding database...");

    await Product.deleteMany(); // 🔥 clear old 84 products

    console.log(`📦 Inserting ${products.length} products`);

    await Product.insertMany(products);

    console.log("✅ Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
