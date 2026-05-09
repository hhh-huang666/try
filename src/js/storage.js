export default class Storage {

    static get getProducts() {
        return JSON.parse(localStorage.getItem("products")) || [];
    }

    static getCategories() {
        return JSON.parse(localStorage.getItem("categories")) || []
    }

    static saveProducts(productsList) {
        localStorage.setItem("products", JSON.stringify(productsList))
    }

    static saveCategories(categoriesList) {
        localStorage.setItem("categories", JSON.stringify(categoriesList))
    }

    static removeProduct(deletedId) {
        // Coerce both sides to string so string ids (uniqueId()) and any
        // legacy numeric ids stored on older clients both match.
        const target = String(deletedId);
        const UpdatedProducts = this.getProducts.filter((product) => String(product.id) !== target)
        this.saveProducts(UpdatedProducts)
    }

    /**
     * Remove a category and reassign every product that referenced it
     * (by title) back to "none". Returns the number of orphaned products
     * that were reassigned, so the UI can toast a warning.
     */
    static removeCategory(deletedId) {
        const target = String(deletedId);
        const before = this.getCategories();
        const removed = before.find((c) => String(c.id) === target);
        const after = before.filter((c) => String(c.id) !== target);
        this.saveCategories(after);

        if (!removed) return 0;
        const products = this.getProducts;
        let reassigned = 0;
        const updated = products.map((p) => {
            if (p.category === removed.title) {
                reassigned += 1;
                return { ...p, category: "none" };
            }
            return p;
        });
        if (reassigned > 0) this.saveProducts(updated);
        return reassigned;
    }

}