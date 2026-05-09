import Storage from "./storage.js";
import { escapeHtml, uniqueId, formatDate, clampQuantity } from "./utils.js";
import { showToast } from "./toast.js";
import { getLang } from "./i18n.js";

export default class ProductView {
    constructor() {
        // variables
        this.pdtTitle = document.querySelector("#productTitle")
        this.pdtIncQty = document.querySelector("#incQty")
        this.pdtDecQty = document.querySelector("#decQty")
        this.pdtLocation = document.querySelector("#productLocations")
        this.ctgSelect = document.querySelector("#categoriesSelect")
        this.pdtAddNew = document.querySelector("#addNewProductBtn")
        this.pdtQty = document.querySelector("#productQuantity")
        this.productCenter = document.querySelector("#productsCenter")
        this.toggleBtns = document.querySelectorAll(".toggleBtn")
        this.searchInput = document.querySelector("#searchInput")
        this.sortSelect = document.querySelector("#sort")
        // event listeners
        this.pdtAddNew.addEventListener("click", () => {
            this.addNewProduct()
        })
        this.toggleBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.toggleProductQty(e)
            })
        })
        this.searchInput.addEventListener("keyup", (e) => {
            this.searchProducts(e.target.value)
        })
        this.sortSelect.addEventListener("change", (e) => {
            this.sortBySelect(e.target.value)
        })
    }

    setupApp() {
        this.showListedProducts(Storage.getProducts)
        this.sortBySelect(this.sortSelect.value)
    }

    addNewProduct() {
        // Race-condition guard: ignore extra clicks within 400 ms of the last one.
        if (!showToast("Saving…", "info", { key: "addProduct", lockMs: 400 })) return;

        if (this.pdtTitle.value.trim().length >= 2) {
            const now = new Date();
            const newProduct = {
                id: uniqueId(),
                title: this.pdtTitle.value.trim(),
                quantity: clampQuantity(this.pdtQty.innerText),
                location: this.pdtLocation.value,
                category: this.ctgSelect.value,
                // Store machine-readable timestamp; format per locale at render time.
                createdAt: now.toISOString(),
                // Kept for backwards compatibility with previously-saved records.
                persianDate: formatDate(now, getLang())
            }
            // reset inputs
            this.pdtTitle.value = ' '
            this.pdtQty.innerText = 0
            this.pdtLocation.value = "none"
            this.ctgSelect.value = "none"
            // persist
            const pdtList = Storage.getProducts
            pdtList.push(newProduct)
            Storage.saveProducts(pdtList)
            // refresh
            this.sortBySelect(this.sortSelect.value)
            this.showListedProducts(pdtList)
            showToast("Product added", "success");
        } else {
            showToast("Title must be at least 2 characters", "error");
        }
    }

    showListedProducts(productList) {
        // XSS hardening: every product field is escaped before string-concat
        // into innerHTML. A title like `<img src=x onerror=alert(1)>` is now
        // rendered as inert text instead of executing.
        const lang = getLang();
        let output = ' '
        productList.forEach(product => {
            // Prefer machine-readable createdAt, fall back to legacy persianDate
            // strings stored before the locale-aware refactor.
            const dateText = product.createdAt
                ? formatDate(product.createdAt, lang)
                : (product.persianDate || "");
            const t  = escapeHtml(product.title);
            const l  = escapeHtml(product.location);
            const c  = escapeHtml(product.category);
            const d  = escapeHtml(dateText);
            const q  = escapeHtml(clampQuantity(product.quantity));
            const id = escapeHtml(product.id);
            output += `
                <li class="flex items-center justify-between  w-full py-2 bg-blue-400/ text-white font-medium ss:min-w-[500px] ss:overflow-x-auto ">
                    <p class="  basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ">${t}</p>
                    <p class="  basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ">${l}</p>
                    <p class="  basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ">${c}</p>
                    <p class="  basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ">${d}</p>
                    <p class="  border-2 border-slate-400 p-1 rounded-2xl ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ">${q}</p>
                    <svg id="${id}" role="button" tabindex="0" aria-label="Delete product"
                        class=" pdt-dlt-btn stroke-red-500 dd:h-6 dd:w-6 ss:h-5 ss:w-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600 rounded"
                        xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </li>
            `
        })
        this.productCenter.innerHTML = output;
        this.productsAction()
    }

    productsAction() {
        // Keyboard support: delete via Enter / Space on the focused icon.
        const removeBtns = [...document.querySelectorAll(".pdt-dlt-btn")]
        removeBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => this.deleteProduct(e));
            btn.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.deleteProduct(e);
                }
            });
        })
    }

    toggleProductQty(e) {
        // Numeric arithmetic instead of string ++/--, with a floor at 0
        // because a stock count cannot legitimately be negative.
        const current = clampQuantity(this.pdtQty.innerText);
        if (e.currentTarget.id === "incQty") {
            this.pdtQty.innerText = current + 1;
        } else if (e.currentTarget.id === "decQty") {
            if (current === 0) {
                showToast("Quantity cannot be negative", "error",
                    { key: "qtyFloor", lockMs: 600 });
                return;
            }
            this.pdtQty.innerText = current - 1;
        }
    }

    deleteProduct(e) {
        // ids are now strings (timestamp-rand). Pass as-is.
        const productId = e.currentTarget.id
        Storage.removeProduct(productId)
        this.showListedProducts(Storage.getProducts)
        this.sortBySelect(this.sortSelect.value)
        showToast("Product deleted", "success");
    }

    searchProducts(searchTerm) {
        const addedProducts = Storage.getProducts
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        const filteredProducts = addedProducts.filter((product) =>
            product.title.toLowerCase().trim().includes(normalizedSearchTerm)
        );
        this.sortBySelect(this.sortSelect.value)
        this.showListedProducts(filteredProducts);
    }

    sortBySelect(sortType) {
        let saveProducts = Storage.getProducts
        let sortedProducts = [];
        if (sortType === "newest") {
            sortedProducts = saveProducts.slice().sort((a, b) => b.id - a.id);
        } else if (sortType === "oldest") {
            sortedProducts = saveProducts.slice().sort((a, b) => a.id - b.id);
        } else if (sortType ==="A-Z" ){
            sortedProducts = saveProducts.slice().sort((a,b)=> a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        } else if (sortType ==="Z-A" ){
            sortedProducts = saveProducts.slice().sort((a,b)=> a.title.toLowerCase().localeCompare(b.title.toLowerCase())).reverse()
        } else {
            sortedProducts = saveProducts.slice();
        }
        this.showListedProducts(sortedProducts);
    }

}