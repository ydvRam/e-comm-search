const express = require("express");
const {
  createProduct,
  getMetadata,
  updateMetadata
} = require("../controllers/product.controllers");

const router = express.Router();

router.post("/", createProduct);
router.get("/meta-data", getMetadata);
router.put("/meta-data", updateMetadata);

module.exports = router;
