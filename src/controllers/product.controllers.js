const mongoose = require("mongoose");
const Product = require("../models/product");

function isValidObjectId(id) {
  if (!id || typeof id !== "string") return false;
  return /^[a-fA-F0-9]{24}$/.test(id) && mongoose.Types.ObjectId.isValid(id);
}

/** List a few products so you can copy _id for metadata API */
exports.listProducts = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);
    const products = await Product.find()
      .select("_id title price")
      .limit(limit)
      .lean();
    return res.json({
      message: "Copy an _id from below to use in the metadata URL",
      count: products.length,
      data: products
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ productId: product._id });
  } catch (err) {
    res.status(400).json({ error: "Invalid product data" });
  }
};

exports.getMetadata = async (req, res) => {
  try {
    const productId = req.query.productId || req.body?.productId;
    if (!productId) {
      return res.status(400).json({
        message: "productId is required (query: ?productId=...)"
      });
    }
    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid productId. Use a real product ID from your database (24-character hex string). Example: GET /api/v1/product/meta-data?productId=507f1f77bcf86cd799439011"
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ productId: product._id, metadata: product.metadata || {} });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateMetadata = async (req, res) => {
  try {
    const productId = req.body.productId || req.query.productId;
    const metadata = req.body.metadata;

    if (!productId || !metadata || typeof metadata !== "object") {
      return res.status(400).json({
        message: "productId and metadata are required. Use JSON body: { \"productId\": \"<id>\", \"metadata\": { ... } } or query ?productId=<id> with body { \"metadata\": { ... } }"
      });
    }
    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid productId. Use a real product ID from your database (24-character hex string)."
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    product.metadata = {
      ...product.metadata,
      ...metadata
    };

    await product.save();

    return res.json({
      productId: product._id,
      metadata: product.metadata
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


