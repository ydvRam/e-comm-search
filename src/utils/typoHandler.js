const levenshtein = require("fast-levenshtein");

// Known product terms to correct common typos (e.g. ipone -> iphone)
const KNOWN_TERMS = [
  "iphone", "samsung", "laptop", "mobile", "phone", "apple",
  "electronics", "tablet", "watch", "headphone", "camera"
];

function isSimilar(a, b) {
  if (!a || !b) return false;
  return levenshtein.get(String(a).toLowerCase(), String(b).toLowerCase()) <= 2;
}

exports.isSimilar = isSimilar;

/** Return canonical term if word is a typo of a known term, else return word as-is */
exports.getCanonicalKeyword = (word) => {
  if (!word || typeof word !== "string") return word;
  const w = word.toLowerCase().trim();
  const found = KNOWN_TERMS.find(term => isSimilar(w, term));
  return found ? found : w;
};
