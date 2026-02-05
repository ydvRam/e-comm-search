const Product = require("../models/product");
const { calculateScore } = require("../utils/scoring");
const { getCanonicalKeyword } = require("../utils/typoHandler");
const { parseQuery, extractPriceLimit } = require("../utils/queryParser");

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.searchProducts = async (req, res) => {
  try {
    const rawQuery = req.query.query?.toLowerCase() || "";

    if (!rawQuery) {
      const popular = await Product.find().sort({ rating: -1 }).limit(10);
      return res.json({ data: popular });
    }

    const intent = parseQuery(rawQuery);
    const priceLimit = intent.priceLimit || extractPriceLimit(rawQuery);
    if (priceLimit) intent.priceLimit = priceLimit;

    const words = rawQuery.split(" ").filter(Boolean);
    const firstWord = words[0] || rawQuery;
    const keyword = getCanonicalKeyword(firstWord);
    intent.keyword = keyword;

    let mongoQuery = { $text: { $search: keyword } };
    if (priceLimit) {
      mongoQuery.price = { $lte: priceLimit };
    }

    let products = [];
    try {
      products = await Product.find(
        mongoQuery,
        { score: { $meta: "textScore" } }
      );
    } catch (_) {}

    if (products.length === 0) {
      const safeKeyword = escapeRegex(keyword);
      const regex = new RegExp(safeKeyword, "i");
      const fallbackQuery = {
        $or: [
          { title: regex },
          { description: regex },
          { "metadata.model": regex },
          { "metadata.storage": regex },
          { "metadata.color": regex }
        ]
      };
      if (priceLimit) {
        fallbackQuery.price = { $lte: priceLimit };
      }
      products = await Product.find(fallbackQuery);
    }

    const withScores = products
      .map((p) => {
        const result = calculateScore(p, intent);
        return {
          product: p,
          score: result.total,
          scoreBreakdown: result.breakdown
        };
      })
      .sort((a, b) => b.score - a.score);

    const data = withScores.map((x) => {
      const doc = x.product.toObject ? x.product.toObject() : { ...x.product };
      delete doc.score;
      return {
        ...doc,
        rankScore: x.score,
        scoreBreakdown: x.scoreBreakdown
      };
    });

    res.json({
      data,
      rankedByScore: withScores.map((x) => ({
        productId: x.product._id,
        title: x.product.title,
        score: x.score,
        scoreBreakdown: x.scoreBreakdown
      }))
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({
      error: "Search failed",
      detail: err.message
    });
  }
};
