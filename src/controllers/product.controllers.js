const Product = require("..//models/product");

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


