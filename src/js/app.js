import ProductView from "./productView.js";
import CategoryView from "./categoryView.js";
import CookieBanner from "./cookieBanner.js";
import { applyTranslations, toggleLang, getLang } from "./i18n.js";

document.addEventListener("DOMContentLoaded", () => {
    const productView = new ProductView();
    const categoryView = new CategoryView();
    categoryView.setupApp();
    productView.setupApp();

    applyTranslations(getLang());
    const langBtn = document.getElementById("langToggle");
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            toggleLang();
            // Re-render so dates and "no categories" placeholder pick up the
            // newly active locale.
            productView.sortBySelect(productView.sortSelect.value);
            categoryView.refreshAll();
        });
    }

    new CookieBanner().init();
});
