// Lightweight non-blocking feedback. Replaces alert() and silent successes.
// Race-condition guard: callers can pass a `lockMs` window during which the
// same `key` will be ignored, so a double-click on "Add" does not enqueue
// duplicate work.

const recent = new Map(); // key -> last fire timestamp

/**
 * @param {string} message
 * @param {"info"|"success"|"error"} [type]
 * @param {{ key?: string, lockMs?: number, duration?: number }} [opts]
 * @returns {boolean} true if the toast was shown, false if rate-limited
 */
export function showToast(message, type = "info", opts = {}) {
    const { key, lockMs = 0, duration = 2200 } = opts;

    if (key && lockMs > 0) {
        const now = Date.now();
        const last = recent.get(key) || 0;
        if (now - last < lockMs) return false;
        recent.set(key, now);
    }

    const host = ensureHost();
    const item = document.createElement("div");
    item.setAttribute("role", "status");
    item.setAttribute("aria-live", "polite");
    item.className = [
        "pointer-events-auto px-4 py-2 rounded-lg shadow-lg text-sm font-medium",
        "border-2 transition-opacity duration-300",
        type === "success" ? "bg-[#1a262d] border-green-600 text-green-400" :
        type === "error"   ? "bg-[#2a1a1a] border-red-500   text-red-300"   :
                             "bg-[#1a262d] border-stone-500 text-stone-200"
    ].join(" ");
    item.textContent = message;
    host.appendChild(item);

    setTimeout(() => { item.style.opacity = "0"; }, duration - 300);
    setTimeout(() => { item.remove(); }, duration);
    return true;
}

function ensureHost() {
    let host = document.getElementById("toastHost");
    if (host) return host;
    host = document.createElement("div");
    host.id = "toastHost";
    host.className = "fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(host);
    return host;
}

// Test hook
export function _resetToastState() { recent.clear(); }
