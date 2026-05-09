"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clampQuantity = clampQuantity;
exports.createProduct = createProduct;
exports.escapeHtml = escapeHtml;
exports.filterByTitle = filterByTitle;
exports.findCategoryByTitle = findCategoryByTitle;
exports.formatDate = formatDate;
exports.sortProducts = sortProducts;
exports.uniqueId = uniqueId;
exports.validateTitle = validateTitle;
function validateTitle(title) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  if (typeof title !== "string") return false;
  return title.trim().length >= min;
}

/**
 * Escape user-controlled strings before they are concatenated into an
 * innerHTML template. Prevents stored-XSS via product / category titles.
 * Reference: OWASP XSS Prevention Cheat Sheet, Rule #1.
 */
function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
 * Collision-resistant id: timestamp + 4 random hex chars.
 * Avoids duplicate ids when two clicks land in the same millisecond.
 */
function uniqueId() {
  var rand = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0");
  return "".concat(Date.now(), "-").concat(rand);
}

/**
 * Format a date for display using the active UI locale.
 * Falls back to en-US for unknown languages. Accepts a Date, an ISO
 * string, or any value `new Date(x)` can parse.
 */
function formatDate(value) {
  var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "en";
  var date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  var locale = lang === "zh" ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

/**
 * Clamp a quantity to a non-negative integer. Stock counts cannot be
 * negative — this is the single source of truth for that invariant so
 * both the +/- buttons and the storage layer stay consistent.
 */
function clampQuantity(value) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.floor(n));
}
function filterByTitle(products, term) {
  if (!Array.isArray(products)) return [];
  var normalized = String(term || "").toLowerCase().trim();
  if (!normalized) return products.slice();
  return products.filter(function (p) {
    return typeof (p === null || p === void 0 ? void 0 : p.title) === "string" && p.title.toLowerCase().trim().includes(normalized);
  });
}
function sortProducts(products, sortType) {
  if (!Array.isArray(products)) return [];
  var arr = products.slice();
  switch (sortType) {
    case "newest":
      return arr.sort(function (a, b) {
        return b.id - a.id;
      });
    case "oldest":
      return arr.sort(function (a, b) {
        return a.id - b.id;
      });
    case "A-Z":
      return arr.sort(function (a, b) {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      });
    case "Z-A":
      return arr.sort(function (a, b) {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      }).reverse();
    default:
      return arr;
  }
}
function createProduct(_ref) {
  var title = _ref.title,
    quantity = _ref.quantity,
    location = _ref.location,
    category = _ref.category;
  var idProvider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return Date.now();
  };
  return {
    id: idProvider(),
    title: String(title).trim(),
    quantity: Number(quantity) || 0,
    location: location || "none",
    category: category || "none"
  };
}
function findCategoryByTitle(categories, title) {
  if (!Array.isArray(categories)) return undefined;
  return categories.find(function (c) {
    return (c === null || c === void 0 ? void 0 : c.title) === title;
  });
}
