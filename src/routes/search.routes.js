const express = require("express");
const { searchProducts } = require("../controllers/search.controllers");

const router = express.Router();

router.get("/product", searchProducts);

module.exports = router;
