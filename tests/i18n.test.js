import {
    translations,
    getLang,
    setLang,
    t,
    applyTranslations,
    toggleLang
} from "../src/js/i18n.js";

describe("translations dictionary", () => {
    test("contains English and Chinese", () => {
        expect(translations.en).toBeDefined();
        expect(translations.zh).toBeDefined();
    });

    test("every English key has a Chinese counterpart", () => {
        const enKeys = Object.keys(translations.en);
        const zhKeys = Object.keys(translations.zh);
        expect(zhKeys.sort()).toEqual(enKeys.sort());
    });
});

describe("getLang / setLang", () => {
    beforeEach(() => localStorage.clear());

    test("defaults to 'en' when nothing stored", () => {
        expect(getLang()).toBe("en");
    });

    test("persists and reads supported lang", () => {
        setLang("zh");
        expect(getLang()).toBe("zh");
    });

    test("rejects unsupported lang and returns default", () => {
        const out = setLang("fr");
        expect(out).toBe("en");
        expect(localStorage.getItem("lang")).toBeNull();
    });
});

describe("t()", () => {
    test("returns the key itself when missing", () => {
        expect(t("nonexistent", "en")).toBe("nonexistent");
    });

    test("returns English for en", () => {
        expect(t("cancel", "en")).toBe("Cancel");
    });

    test("returns Chinese for zh", () => {
        expect(t("cancel", "zh")).toBe("取消");
    });

    test("falls back to English when language is unknown", () => {
        expect(t("cancel", "de")).toBe("Cancel");
    });
});

describe("applyTranslations", () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `
            <h1 data-i18n="appTitle">x</h1>
            <input id="s" data-i18n-placeholder="search" data-i18n-aria="search" placeholder="x" />
        `;
    });

    test("updates textContent for [data-i18n]", () => {
        applyTranslations("en");
        expect(document.querySelector("h1").textContent).toBe(translations.en.appTitle);
    });

    test("updates placeholder and aria-label", () => {
        applyTranslations("zh");
        const input = document.getElementById("s");
        expect(input.getAttribute("placeholder")).toBe(translations.zh.search);
        expect(input.getAttribute("aria-label")).toBe(translations.zh.search);
    });

    test("sets <html lang='...'>", () => {
        applyTranslations("zh");
        expect(document.documentElement.getAttribute("lang")).toBe("zh");
    });
});

describe("toggleLang", () => {
    beforeEach(() => localStorage.clear());

    test("switches en -> zh", () => {
        setLang("en");
        expect(toggleLang()).toBe("zh");
    });

    test("switches zh -> en", () => {
        setLang("zh");
        expect(toggleLang()).toBe("en");
    });
});
