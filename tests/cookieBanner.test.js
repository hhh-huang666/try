import CookieBanner, {
    hasConsent,
    setConsent,
    clearConsent
} from "../src/js/cookieBanner.js";

describe("consent helpers", () => {
    beforeEach(() => localStorage.clear());

    test("hasConsent is false initially", () => {
        expect(hasConsent()).toBe(false);
    });

    test("setConsent('accepted') -> hasConsent true", () => {
        setConsent("accepted");
        expect(hasConsent()).toBe(true);
    });

    test("setConsent('rejected') -> hasConsent false", () => {
        setConsent("rejected");
        expect(hasConsent()).toBe(false);
    });

    test("clearConsent removes the key", () => {
        setConsent("accepted");
        clearConsent();
        expect(hasConsent()).toBe(false);
    });
});

describe("CookieBanner class", () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `
            <div id="cookieBanner" class="hidden"></div>
            <button id="cookieAccept"></button>
            <button id="cookieReject"></button>
        `;
    });

    test("shows banner when no consent stored", () => {
        const banner = new CookieBanner();
        banner.init();
        expect(document.getElementById("cookieBanner").classList.contains("hidden")).toBe(false);
    });

    test("stays hidden if consent already recorded", () => {
        setConsent("accepted");
        const banner = new CookieBanner();
        banner.init();
        expect(document.getElementById("cookieBanner").classList.contains("hidden")).toBe(true);
    });

    test("accept click records consent and hides banner", () => {
        const banner = new CookieBanner();
        banner.init();
        document.getElementById("cookieAccept").click();
        expect(hasConsent()).toBe(true);
        expect(document.getElementById("cookieBanner").classList.contains("hidden")).toBe(true);
    });

    test("reject click records rejection and hides banner", () => {
        const banner = new CookieBanner();
        banner.init();
        document.getElementById("cookieReject").click();
        expect(localStorage.getItem("cookieConsent")).toBe("rejected");
        expect(document.getElementById("cookieBanner").classList.contains("hidden")).toBe(true);
    });

    test("init is safe when banner element is missing", () => {
        document.body.innerHTML = "";
        const banner = new CookieBanner();
        expect(() => banner.init()).not.toThrow();
    });
});
