const express = require("express");

const productRoutes = require("./routes/product.routes");
const searchRoutes = require("./routes/search.routes");

const app = express();

app.use(express.json());

app.use("/api/v1/product", productRoutes);
app.use("/api/v1/search", searchRoutes);

module.exports = app;
