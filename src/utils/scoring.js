exports.calculateScore = (product, intent) => {
  const title = product.title != null ? String(product.title).toLowerCase() : "";
  const textScore = title.includes(intent.keyword) ? 1 : 0.5;

  const price = Number(product.price);
  const priceScore = intent.isCheap && !Number.isNaN(price)
    ? Math.max(0, 1 - price / 100000)
    : 0.5;

  const rating = Number(product.rating);
  const ratingScore = !Number.isNaN(rating) ? rating / 5 : 0.5;

  const stock = Number(product.stock);
  const stockScore = stock > 0 ? 1 : 0;

  const createdAt = product.createdAt ? new Date(product.createdAt) : new Date();
  const ageDays = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
  const recencyScore = ageDays < 180 ? 1 : 0.5;

  return (
    textScore * 0.35 +
    priceScore * 0.25 +
    ratingScore * 0.2 +
    stockScore * 0.1 +
    recencyScore * 0.1
  );
};
