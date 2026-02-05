const express = require("express");
const {
  listProducts,
  createProduct,
  getMetadata,
  updateMetadata
} = require("../controllers/product.controllers");

const router = express.Router();

router.get("/", listProducts);
router.post("/", createProduct);
router.get("/meta-data", getMetadata);
router.put("/meta-data", updateMetadata);

module.exports = router;
