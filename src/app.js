const express = require("express");

const productRoutes = require("./routes/product.routes");
const searchRoutes = require("./routes/search.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "E-commerce Search API",
    docs: "Use /api/v1 for API calls",
    search: "GET /api/v1/search/product?query=iphone",
    metadata: "GET /api/v1/product/meta-data?productId=<id>"
  });
});

app.use("/api/v1/product", productRoutes);
app.use("/api/v1/search", searchRoutes);

module.exports = app;
