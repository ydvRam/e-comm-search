const fs = require("fs");
const path = require("path");

/* 1️⃣ Base data */
const brands = [
  { name: "Apple", models: ["iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16"] },
  { name: "Samsung", models: ["Galaxy S22", "Galaxy S23", "Galaxy S24", "Galaxy A54"] },
  { name: "OnePlus", models: ["OnePlus 10", "OnePlus 11", "OnePlus 12"] },
  { name: "Xiaomi", models: ["Redmi Note 12", "Redmi Note 13", "Mi 11", "Mi 12"] },
  { name: "Realme", models: ["Realme 10", "Realme 11 Pro", "Realme GT"] },
  { name: "Vivo", models: ["Vivo V25", "Vivo V27", "Vivo V29"] }
];

const storages = ["64GB", "128GB", "256GB", "512GB"];
const colors = ["Black", "Blue", "White", "Red", "Green"];
const rams = ["6GB", "8GB", "12GB"];
const priceTiers = [0.9, 1.1]; 

let products = [];

/* 2️⃣ Product generation logic */
brands.forEach(brand => {
  brand.models.forEach(model => {
    storages.forEach(storage => {
      colors.forEach(color => {
        rams.forEach(ram => {
          priceTiers.forEach(multiplier => {

            const basePrice = 25000 + Math.floor(Math.random() * 40000);
            const price = Math.floor(basePrice * multiplier);

            products.push({
              title: `${model} ${ram} ${storage} ${color}`,
              description: `${model} smartphone with ${ram} RAM, ${storage} storage in ${color} color`,
              price,
              mrp: Math.floor(price * 1.4),
              rating: +(3 + Math.random() * 2).toFixed(1),
              stock: Math.floor(Math.random() * 200),
              currency: "Rupee",

              metadata: {
                category: "electronics",
                subCategory: "mobile",
                brand: brand.name,
                model,
                storage,
                ram,
                color
              },

              createdAt: new Date()
            });

          });
        });
      });
    });
  });
});

const outputPath = path.join(__dirname, "../data/products.json");

fs.writeFileSync(
  outputPath,
  JSON.stringify(products, null, 2)
);

console.log(`✅ Generated ${products.length} electronics products`);
