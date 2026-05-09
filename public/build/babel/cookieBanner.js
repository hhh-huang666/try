"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearConsent = clearConsent;
exports["default"] = void 0;
exports.hasConsent = hasConsent;
exports.setConsent = setConsent;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CONSENT_KEY = "cookieConsent";
function hasConsent() {
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}
function setConsent(value) {
  localStorage.setItem(CONSENT_KEY, value);
}
function clearConsent() {
  localStorage.removeItem(CONSENT_KEY);
}
var CookieBanner = exports["default"] = /*#__PURE__*/function () {
  function CookieBanner() {
    _classCallCheck(this, CookieBanner);
    this.banner = document.getElementById("cookieBanner");
    this.acceptBtn = document.getElementById("cookieAccept");
    this.rejectBtn = document.getElementById("cookieReject");
  }
  return _createClass(CookieBanner, [{
    key: "init",
    value: function init() {
      var _this$acceptBtn,
        _this = this,
        _this$rejectBtn;
      if (!this.banner) return;
      if (localStorage.getItem(CONSENT_KEY)) {
        this.banner.classList.add("hidden");
        return;
      }
      this.banner.classList.remove("hidden");
      (_this$acceptBtn = this.acceptBtn) === null || _this$acceptBtn === void 0 || _this$acceptBtn.addEventListener("click", function () {
        return _this.handle("accepted");
      });
      (_this$rejectBtn = this.rejectBtn) === null || _this$rejectBtn === void 0 || _this$rejectBtn.addEventListener("click", function () {
        return _this.handle("rejected");
      });
    }
  }, {
    key: "handle",
    value: function handle(value) {
      setConsent(value);
      this.banner.classList.add("hidden");
    }
  }]);
}();
