exports.calculateScore = (product, intent) => {
  const textScore = product.title
    .toLowerCase()
    .includes(intent.keyword)
    ? 1
    : 0.5;

  const priceScore = intent.isCheap
    ? Math.max(0, 1 - product.price / 100000)
    : 0.5;

  const ratingScore = product.rating / 5;

  const stockScore = product.stock > 0 ? 1 : 0;

  const ageDays =
    (Date.now() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24);
  const recencyScore = ageDays < 180 ? 1 : 0.5;

  return (
    textScore * 0.35 +
    priceScore * 0.25 +
    ratingScore * 0.2 +
    stockScore * 0.1 +
    recencyScore * 0.1
  );
};
