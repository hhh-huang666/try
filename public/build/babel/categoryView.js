"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _storage = _interopRequireDefault(require("./storage.js"));
var _toast = require("./toast.js");
var _utils = require("./utils.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CategoryView = exports["default"] = /*#__PURE__*/function () {
  function CategoryView() {
    var _this = this;
    _classCallCheck(this, CategoryView);
    // form fields
    this.ctgTitleInput = document.querySelector("#categoryTitle");
    this.ctgDescInput = document.querySelector("#categoryDescription");
    this.ctgCacelBtn = document.querySelector("#categoryCanelBtn");
    this.ctgAddBtn = document.querySelector("#categoryAddNewBtn");
    this.ctgSelect = document.querySelector("#categoriesSelect");
    // list container (new)
    this.ctgListCenter = document.querySelector("#categoriesListCenter");
    this.ctgAddBtn.addEventListener("click", function () {
      return _this.addNewCategory();
    });
    this.ctgCacelBtn.addEventListener("click", function () {
      _this.ctgTitleInput.value = ' ';
      _this.ctgDescInput.value = ' ';
    });
  }
  return _createClass(CategoryView, [{
    key: "setupApp",
    value: function setupApp() {
      this.refreshAll();
    }

    /** Re-renders both the dropdown and the visible list. */
  }, {
    key: "refreshAll",
    value: function refreshAll() {
      var categories = _storage["default"].getCategories();
      this.instantCtgUpdate(categories);
      this.renderCategoriesList(categories);
    }

    /** Hook for ProductView so it can ask the list to re-render after
     *  category-affecting changes (e.g. language toggle). */
  }, {
    key: "onLanguageChange",
    value: function onLanguageChange() {
      this.renderCategoriesList(_storage["default"].getCategories());
    }
  }, {
    key: "addNewCategory",
    value: function addNewCategory() {
      // Race-condition guard for double-click.
      if (!(0, _toast.showToast)("Saving…", "info", {
        key: "addCategory",
        lockMs: 400
      })) return;
      if (this.ctgTitleInput.value.trim().length >= 2) {
        var newCategroy = {
          id: Date.now(),
          title: this.ctgTitleInput.value.trim(),
          description: this.ctgDescInput.value.trim()
        };
        this.ctgTitleInput.value = ' ';
        this.ctgDescInput.value = ' ';
        var savedCategories = _storage["default"].getCategories();
        var existedItem = savedCategories.find(function (c) {
          return c.title === newCategroy.title;
        });
        if (existedItem) {
          existedItem.title = newCategroy.title;
          existedItem.description = newCategroy.description;
          _storage["default"].saveCategories(savedCategories);
          this.refreshAll();
          (0, _toast.showToast)("Category description updated", "info");
          return;
        } else {
          newCategroy.createdAt = new Date().toISOString();
          savedCategories.push(newCategroy);
        }
        _storage["default"].saveCategories(savedCategories);
        this.refreshAll();
        (0, _toast.showToast)("Category added", "success");
      } else {
        (0, _toast.showToast)("Title must be at least 2 characters", "error");
      }
    }

    /** Build the <select> dropdown for products. */
  }, {
    key: "instantCtgUpdate",
    value: function instantCtgUpdate(categories) {
      var _this2 = this;
      var ctgListTitles = categories.map(function (obj) {
        return obj.title.trim();
      });
      this.ctgSelect.innerHTML = " <option selected value=\"none\">- select category -</option>  ";
      ctgListTitles.forEach(function (option) {
        var newOption = document.createElement("option");
        newOption.value = option;
        newOption.textContent = option;
        _this2.ctgSelect.append(newOption);
      });
    }

    /** Render the visible categories list with delete buttons. */
  }, {
    key: "renderCategoriesList",
    value: function renderCategoriesList(categories) {
      if (!this.ctgListCenter) return;
      if (!categories || categories.length === 0) {
        this.ctgListCenter.innerHTML = "\n                <li data-i18n=\"noCategories\" class=\"text-stone-400 text-sm italic text-center py-2\">\n                    No categories yet \u2014 add one above.\n                </li>";
        return;
      }
      // XSS hardening: escape every user-controlled field before innerHTML.
      var html = categories.map(function (c) {
        return "\n            <li class=\"flex items-center justify-between gap-3 py-2 px-2 rounded-lg hover:bg-[#243038]\">\n                <div class=\"flex flex-col flex-1 min-w-0\">\n                    <span class=\"text-stone-100 font-medium truncate\">".concat((0, _utils.escapeHtml)(c.title), "</span>\n                    <span class=\"text-stone-400 text-xs truncate\">").concat((0, _utils.escapeHtml)(c.description) || "—", "</span>\n                </div>\n                <svg id=\"ctg-").concat((0, _utils.escapeHtml)(c.id), "\" role=\"button\" tabindex=\"0\"\n                    aria-label=\"Delete category ").concat((0, _utils.escapeHtml)(c.title), "\"\n                    class=\"ctg-dlt-btn stroke-red-500 dd:h-6 dd:w-6 ss:h-5 ss:w-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600 rounded shrink-0\"\n                    xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\"\n                    viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\"\n                        d=\"m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0\" />\n                </svg>\n            </li>\n        ");
      }).join("");
      this.ctgListCenter.innerHTML = html;
      this.bindCategoryDeletes();
    }
  }, {
    key: "bindCategoryDeletes",
    value: function bindCategoryDeletes() {
      var _this3 = this;
      var removeBtns = this.ctgListCenter.querySelectorAll(".ctg-dlt-btn");
      removeBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          return _this3.deleteCategory(e);
        });
        btn.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            _this3.deleteCategory(e);
          }
        });
      });
    }
  }, {
    key: "deleteCategory",
    value: function deleteCategory(e) {
      // id format on the SVG is "ctg-<categoryId>"
      var raw = e.currentTarget.id || "";
      var categoryId = raw.replace(/^ctg-/, "");
      var reassigned = _storage["default"].removeCategory(categoryId);
      this.refreshAll();
      if (reassigned > 0) {
        (0, _toast.showToast)("Category deleted \u2014 ".concat(reassigned, " product(s) reset to \"none\""), "info");
      } else {
        (0, _toast.showToast)("Category deleted", "success");
      }
    }
  }]);
}();
