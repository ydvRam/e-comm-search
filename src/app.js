const express = require("express");

const productRoutes = require("./routes/product.routes");
const searchRoutes = require("./routes/search.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "E-commerce Search API",
    docs: "Use /api/v1 for API calls",
    endpoints: {
      search: "GET /api/v1/search/product?query=iphone",
      listProducts: "GET /api/v1/product (returns products with _id — copy one for metadata)",
      getMetadata: "GET /api/v1/product/meta-data?productId=<paste-_id-here>",
      updateMetadata: "PUT /api/v1/product/meta-data (body: productId, metadata)"
    }
  });
});

app.use("/api/v1/product", productRoutes);
app.use("/api/v1/search", searchRoutes);

module.exports = app;
