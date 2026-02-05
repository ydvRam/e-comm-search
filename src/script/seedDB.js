const mongoose = require("mongoose");
const Product = require("../models/product");
const products = require("../data/products.json"); 

mongoose.connect("mongodb+srv://ramyadav8395_db_user:Yadav%407457@cluster0.rrsmvam.mongodb.net/?appName=Cluster0");

async function seed() {
  try {
    console.log("⏳ Seeding database...");

    await Product.deleteMany(); // 🔥 clear old 84 products

    console.log(`📦 Inserting ${products.length} products`);

    const withSales = products.map((p) => ({
      ...p,
      unitsSold: p.unitsSold ?? Math.floor(50 + Math.random() * 950)
    }));
    await Product.insertMany(withSales);

    console.log("✅ Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
