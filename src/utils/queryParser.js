exports.extractPriceLimit = (query) => {
  const match = query.match(/(\d+)\s?k/);
  return match ? parseInt(match[1]) * 1000 : null;
};
