const Product = require("..//models/product");

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ productId: product._id });
  } catch (err) {
    res.status(400).json({ error: "Invalid product data" });
  }
};

exports.updateMetadata = async (req, res) => {
  try {
    const { productId, metadata } = req.body;

    if (!productId || !metadata) {
      return res.status(400).json({
        message: "productId and metadata are required"
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


