"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Storage = exports["default"] = /*#__PURE__*/function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }
  return _createClass(Storage, null, [{
    key: "getProducts",
    get: function get() {
      return JSON.parse(localStorage.getItem("products")) || [];
    }
  }, {
    key: "getCategories",
    value: function getCategories() {
      return JSON.parse(localStorage.getItem("categories")) || [];
    }
  }, {
    key: "saveProducts",
    value: function saveProducts(productsList) {
      localStorage.setItem("products", JSON.stringify(productsList));
    }
  }, {
    key: "saveCategories",
    value: function saveCategories(categoriesList) {
      localStorage.setItem("categories", JSON.stringify(categoriesList));
    }
  }, {
    key: "removeProduct",
    value: function removeProduct(deletedId) {
      // Coerce both sides to string so string ids (uniqueId()) and any
      // legacy numeric ids stored on older clients both match.
      var target = String(deletedId);
      var UpdatedProducts = this.getProducts.filter(function (product) {
        return String(product.id) !== target;
      });
      this.saveProducts(UpdatedProducts);
    }

    /**
     * Remove a category and reassign every product that referenced it
     * (by title) back to "none". Returns the number of orphaned products
     * that were reassigned, so the UI can toast a warning.
     */
  }, {
    key: "removeCategory",
    value: function removeCategory(deletedId) {
      var target = String(deletedId);
      var before = this.getCategories();
      var removed = before.find(function (c) {
        return String(c.id) === target;
      });
      var after = before.filter(function (c) {
        return String(c.id) !== target;
      });
      this.saveCategories(after);
      if (!removed) return 0;
      var products = this.getProducts;
      var reassigned = 0;
      var updated = products.map(function (p) {
        if (p.category === removed.title) {
          reassigned += 1;
          return _objectSpread(_objectSpread({}, p), {}, {
            category: "none"
          });
        }
        return p;
      });
      if (reassigned > 0) this.saveProducts(updated);
      return reassigned;
    }
  }]);
}();
