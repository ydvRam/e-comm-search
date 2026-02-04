const express = require("express");
const {
  createProduct,
  updateMetadata
} = require("../controllers/product.controllers");

const router = express.Router();

router.post("/", createProduct);
router.put("/meta-data", updateMetadata);

module.exports = router;
