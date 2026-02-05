/**
 * Parse search query into intent for ranking and filtering.
 * Handles: Latest iphone, Sastha wala iPhone, Ifone 16, red color, more storage, 50k rupees.
 */
const COLOR_WORDS = [
  "red", "blue", "black", "white", "green", "gold", "silver", "grey", "gray",
  "pink", "purple", "yellow", "orange", "starlight", "midnight"
];

function extractPriceLimit(query) {
  const match = query.match(/(\d+)\s?k/);
  return match ? parseInt(match[1], 10) * 1000 : null;
}

function hasCheapIntent(query) {
  return /\b(sasta|sastha|cheap|sastawala|sasthawala)\b/i.test(query);
}

function hasLatestIntent(query) {
  return /\b(latest|new|newest)\b/i.test(query);
}

function extractColor(query) {
  const q = query.toLowerCase();
  const found = COLOR_WORDS.find((c) => q.includes(c));
  return found || null;
}

function wantsMoreStorage(query) {
  return /\b(more\s+storage|storage|higher\s+storage|128gb|256gb|512gb)\b/i.test(query);
}

/**
 * Returns intent object for ranking/filtering.
 */
function parseQuery(rawQuery) {
  const q = (rawQuery || "").toLowerCase().trim();
  return {
    priceLimit: extractPriceLimit(q),
    isCheap: hasCheapIntent(q),
    isLatest: hasLatestIntent(q),
    color: extractColor(q),
    wantsMoreStorage: wantsMoreStorage(q)
  };
}

module.exports = {
  extractPriceLimit,
  parseQuery
};
