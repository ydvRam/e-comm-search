const levenshtein = require("fast-levenshtein");

exports.isSimilar = (a, b) => {
  return levenshtein.get(a, b) <= 2;
};
