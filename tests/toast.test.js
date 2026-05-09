import { showToast, _resetToastState } from "../src/js/toast.js";

beforeEach(() => {
    document.body.innerHTML = "";
    _resetToastState();
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe("showToast", () => {
    test("creates a host element on first call and reuses it", () => {
        showToast("first");
        const host = document.getElementById("toastHost");
        expect(host).not.toBeNull();
        showToast("second");
        expect(document.querySelectorAll("#toastHost").length).toBe(1);
    });

    test("renders the message text inside the host", () => {
        showToast("hello world", "success");
        expect(document.getElementById("toastHost").textContent).toContain("hello world");
    });

    test("uses different border colours per type", () => {
        showToast("ok", "success");
        showToast("oops", "error");
        showToast("note", "info");
        const items = document.querySelectorAll("#toastHost > div");
        expect(items[0].className).toMatch(/border-green-600/);
        expect(items[1].className).toMatch(/border-red-500/);
        expect(items[2].className).toMatch(/border-stone-500/);
    });

    test("applies aria-live=polite for screen readers", () => {
        showToast("a11y");
        const item = document.querySelector("#toastHost > div");
        expect(item.getAttribute("aria-live")).toBe("polite");
        expect(item.getAttribute("role")).toBe("status");
    });

    test("rate-limits identical keys within lockMs (race-condition guard)", () => {
        const first = showToast("Saving…", "info", { key: "addProduct", lockMs: 400 });
        const second = showToast("Saving…", "info", { key: "addProduct", lockMs: 400 });
        expect(first).toBe(true);
        expect(second).toBe(false);
    });

    test("allows the same key after lockMs has elapsed", () => {
        showToast("Saving…", "info", { key: "addProduct", lockMs: 400 });
        jest.advanceTimersByTime(401);
        const again = showToast("Saving…", "info", { key: "addProduct", lockMs: 400 });
        expect(again).toBe(true);
    });

    test("removes the toast element after the duration elapses", () => {
        showToast("vanish", "info", { duration: 1000 });
        expect(document.querySelectorAll("#toastHost > div").length).toBe(1);
        jest.advanceTimersByTime(1100);
        expect(document.querySelectorAll("#toastHost > div").length).toBe(0);
    });
});
