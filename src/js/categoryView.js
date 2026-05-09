import Storage from "./storage.js";
import { showToast } from "./toast.js";
import { escapeHtml } from "./utils.js";

export default class CategoryView {
    constructor() {
        // form fields
        this.ctgTitleInput = document.querySelector("#categoryTitle")
        this.ctgDescInput = document.querySelector("#categoryDescription")
        this.ctgCacelBtn = document.querySelector("#categoryCanelBtn")
        this.ctgAddBtn = document.querySelector("#categoryAddNewBtn")
        this.ctgSelect = document.querySelector("#categoriesSelect")
        // list container (new)
        this.ctgListCenter = document.querySelector("#categoriesListCenter")

        this.ctgAddBtn.addEventListener("click", () => this.addNewCategory())
        this.ctgCacelBtn.addEventListener("click", () => {
            this.ctgTitleInput.value = ' '
            this.ctgDescInput.value = ' '
        })
    }

    setupApp() {
        this.refreshAll();
    }

    /** Re-renders both the dropdown and the visible list. */
    refreshAll() {
        const categories = Storage.getCategories();
        this.instantCtgUpdate(categories);
        this.renderCategoriesList(categories);
    }

    /** Hook for ProductView so it can ask the list to re-render after
     *  category-affecting changes (e.g. language toggle). */
    onLanguageChange() {
        this.renderCategoriesList(Storage.getCategories());
    }

    addNewCategory() {
        // Race-condition guard for double-click.
        if (!showToast("Saving…", "info", { key: "addCategory", lockMs: 400 })) return;

        if (this.ctgTitleInput.value.trim().length >= 2) {
            const newCategroy = {
                id: Date.now(),
                title: this.ctgTitleInput.value.trim(),
                description: this.ctgDescInput.value.trim(),
            }
            this.ctgTitleInput.value = ' '
            this.ctgDescInput.value = ' '
            const savedCategories = Storage.getCategories();
            const existedItem = savedCategories.find((c) => c.title === newCategroy.title);
            if (existedItem) {
                existedItem.title = newCategroy.title;
                existedItem.description = newCategroy.description;
                Storage.saveCategories(savedCategories);
                this.refreshAll();
                showToast("Category description updated", "info");
                return
            } else {
                newCategroy.createdAt = new Date().toISOString();
                savedCategories.push(newCategroy);
            }
            Storage.saveCategories(savedCategories)
            this.refreshAll();
            showToast("Category added", "success");
        } else {
            showToast("Title must be at least 2 characters", "error");
        }
    }

    /** Build the <select> dropdown for products. */
    instantCtgUpdate(categories) {
        const ctgListTitles = categories.map(obj => obj.title.trim());
        this.ctgSelect.innerHTML = ` <option selected value="none">- select category -</option>  `;
        ctgListTitles.forEach(option => {
            const newOption = document.createElement("option");
            newOption.value = option;
            newOption.textContent = option;
            this.ctgSelect.append(newOption);
        });
    }

    /** Render the visible categories list with delete buttons. */
    renderCategoriesList(categories) {
        if (!this.ctgListCenter) return;
        if (!categories || categories.length === 0) {
            this.ctgListCenter.innerHTML = `
                <li data-i18n="noCategories" class="text-stone-400 text-sm italic text-center py-2">
                    No categories yet — add one above.
                </li>`;
            return;
        }
        // XSS hardening: escape every user-controlled field before innerHTML.
        const html = categories.map((c) => `
            <li class="flex items-center justify-between gap-3 py-2 px-2 rounded-lg hover:bg-[#243038]">
                <div class="flex flex-col flex-1 min-w-0">
                    <span class="text-stone-100 font-medium truncate">${escapeHtml(c.title)}</span>
                    <span class="text-stone-400 text-xs truncate">${escapeHtml(c.description) || "—"}</span>
                </div>
                <svg id="ctg-${escapeHtml(c.id)}" role="button" tabindex="0"
                    aria-label="Delete category ${escapeHtml(c.title)}"
                    class="ctg-dlt-btn stroke-red-500 dd:h-6 dd:w-6 ss:h-5 ss:w-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600 rounded shrink-0"
                    xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </li>
        `).join("");
        this.ctgListCenter.innerHTML = html;
        this.bindCategoryDeletes();
    }

    bindCategoryDeletes() {
        const removeBtns = this.ctgListCenter.querySelectorAll(".ctg-dlt-btn");
        removeBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => this.deleteCategory(e));
            btn.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.deleteCategory(e);
                }
            });
        });
    }

    deleteCategory(e) {
        // id format on the SVG is "ctg-<categoryId>"
        const raw = e.currentTarget.id || "";
        const categoryId = raw.replace(/^ctg-/, "");
        const reassigned = Storage.removeCategory(categoryId);
        this.refreshAll();
        if (reassigned > 0) {
            showToast(
                `Category deleted — ${reassigned} product(s) reset to "none"`,
                "info"
            );
        } else {
            showToast("Category deleted", "success");
        }
    }
}
