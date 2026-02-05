/**
 * Rank products by: relevance, rating, units sold, price, stock, recency,
 * and query intent (cheap, latest, color, storage).
 * Weights aligned with problem: "Ratings, Units Sold, Stock, Price" + relevance.
 */
function normalizeStorageToNum(storageStr) {
  if (!storageStr || typeof storageStr !== "string") return 0;
  const match = storageStr.match(/(\d+)\s*gb/i);
  return match ? parseInt(match[1], 10) : 0;
}

exports.calculateScore = (product, intent) => {
  const title = product.title != null ? String(product.title).toLowerCase() : "";
  const keyword = (intent.keyword || "").toLowerCase();
  const relevanceScore = keyword && title.includes(keyword) ? 1 : 0.5;

  const rating = Number(product.rating);
  const ratingScore = !Number.isNaN(rating) ? rating / 5 : 0.5;

  const unitsSold = Number(product.unitsSold) || 0;
  const popularityScore = Math.min(1, unitsSold / 1000);

  const price = Number(product.price);
  let priceScore = 0.5;
  if (!Number.isNaN(price)) {
    if (intent.isCheap) {
      priceScore = Math.max(0, 1 - price / 100000);
    } else if (intent.priceLimit != null && intent.priceLimit > 0) {
      priceScore = price <= intent.priceLimit ? 1 : Math.max(0, 1 - (price - intent.priceLimit) / 50000);
    }
  }

  const stock = Number(product.stock);
  const stockScore = stock > 0 ? 1 : 0;

  const createdAt = product.createdAt ? new Date(product.createdAt) : new Date();
  const ageDays = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
  const recencyScore = ageDays < 180 ? 1 : ageDays < 365 ? 0.7 : 0.4;
  const recencyBoost = intent.isLatest ? recencyScore * 1.2 : recencyScore;

  let colorScore = 0.5;
  if (intent.color && product.metadata && product.metadata.color) {
    const productColor = String(product.metadata.color).toLowerCase();
    colorScore = productColor.includes(intent.color) ? 1 : 0.5;
  }

  let storageScore = 0.5;
  if (intent.wantsMoreStorage && product.metadata && product.metadata.storage) {
    const gb = normalizeStorageToNum(product.metadata.storage);
    storageScore = gb >= 128 ? 1 : gb >= 64 ? 0.8 : 0.5;
  }

  const weights = {
    relevance: 0.22,
    rating: 0.2,
    popularity: 0.18,
    price: 0.15,
    stock: 0.08,
    recency: 0.07,
    color: 0.05,
    storage: 0.05
  };

  const total =
    relevanceScore * weights.relevance +
    ratingScore * weights.rating +
    popularityScore * weights.popularity +
    priceScore * weights.price +
    stockScore * weights.stock +
    Math.min(1, recencyBoost) * weights.recency +
    colorScore * weights.color +
    storageScore * weights.storage;

  return {
    total: Math.round(total * 1000) / 1000,
    breakdown: {
      relevance: relevanceScore,
      rating: ratingScore,
      popularity: popularityScore,
      price: priceScore,
      stock: stockScore,
      recency: Math.min(1, recencyBoost),
      color: colorScore,
      storage: storageScore
    }
  };
};
