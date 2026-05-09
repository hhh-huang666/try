const CONSENT_KEY = "cookieConsent";

export function hasConsent() {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
}

export function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
}

export function clearConsent() {
    localStorage.removeItem(CONSENT_KEY);
}

export default class CookieBanner {
    constructor() {
        this.banner = document.getElementById("cookieBanner");
        this.acceptBtn = document.getElementById("cookieAccept");
        this.rejectBtn = document.getElementById("cookieReject");
    }

    init() {
        if (!this.banner) return;
        if (localStorage.getItem(CONSENT_KEY)) {
            this.banner.classList.add("hidden");
            return;
        }
        this.banner.classList.remove("hidden");
        this.acceptBtn?.addEventListener("click", () => this.handle("accepted"));
        this.rejectBtn?.addEventListener("click", () => this.handle("rejected"));
    }

    handle(value) {
        setConsent(value);
        this.banner.classList.add("hidden");
    }
}
