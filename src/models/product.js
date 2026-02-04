const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    rating: Number,
    stock: Number,
    price: Number,
    mrp: Number,
    currency: String,
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);
productSchema.index({
  title: "text",
  description: "text",
  "metadata.model": "text",
  "metadata.storage": "text",
  "metadata.color": "text"
});

module.exports = mongoose.model("Product", productSchema);
