const Product = require("../models/product");
const { calculateScore } = require("../utils/scoring");
const { isSimilar } = require("../utils/typoHandler");
const { extractPriceLimit } = require("../utils/queryParser");

exports.searchProducts = async (req, res) => {
  try {
    const rawQuery = req.query.query?.toLowerCase() || "";

    // Empty query → return popular products
    if (!rawQuery) {
      const popular = await Product.find().sort({ rating: -1 }).limit(10);
      return res.json({ data: popular });
    }

    const isCheap =
      rawQuery.includes("sasta") || rawQuery.includes("cheap");

    const priceLimit = extractPriceLimit(rawQuery);

    const words = rawQuery.split(" ");
    const keyword =
      words.find(w => isSimilar(w, "iphone")) || words[0];

    let mongoQuery = { $text: { $search: keyword } };

    if (priceLimit) {
      mongoQuery.price = { $lte: priceLimit };
    }

    const products = await Product.find(
      mongoQuery,
      { score: { $meta: "textScore" } }
    );

    const ranked = products
      .map(p => ({
        product: p,
        score: calculateScore(p, {
          keyword,
          isCheap
        })
      }))
      .sort((a, b) => b.score - a.score)
      .map(x => x.product);

    res.json({ data: ranked });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};
