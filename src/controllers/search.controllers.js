const Product = require("../models/product");
const { calculateScore } = require("../utils/scoring");
const { getCanonicalKeyword } = require("../utils/typoHandler");
const { extractPriceLimit } = require("../utils/queryParser");

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

    const words = rawQuery.split(" ").filter(Boolean);
    const firstWord = words[0] || rawQuery;
    // Correct typos using known terms (e.g. ipone -> iphone, samsng -> samsung)
    const keyword = getCanonicalKeyword(firstWord);

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
    } catch (_) {
      // Text index may not exist
    }

    // Fallback: if text search returns nothing (typo or no text index), search by regex
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
