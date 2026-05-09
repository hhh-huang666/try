import Storage from "../src/js/storage.js";

describe("Storage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("getProducts returns empty array when nothing stored", () => {
        expect(Storage.getProducts).toEqual([]);
    });

    test("getCategories returns empty array when nothing stored", () => {
        expect(Storage.getCategories()).toEqual([]);
    });

    test("saveProducts persists to localStorage", () => {
        const products = [{ id: 1, title: "A" }];
        Storage.saveProducts(products);
        expect(JSON.parse(localStorage.getItem("products"))).toEqual(products);
        expect(Storage.getProducts).toEqual(products);
    });

    test("saveCategories persists to localStorage", () => {
        const cats = [{ title: "Food" }];
        Storage.saveCategories(cats);
        expect(Storage.getCategories()).toEqual(cats);
    });

    test("removeProduct filters out the matching id", () => {
        Storage.saveProducts([
            { id: 1, title: "A" },
            { id: 2, title: "B" },
            { id: 3, title: "C" }
        ]);
        Storage.removeProduct(2);
        expect(Storage.getProducts.map((p) => p.id)).toEqual([1, 3]);
    });

    test("removeProduct is a no-op when id does not exist", () => {
        Storage.saveProducts([{ id: 1, title: "A" }]);
        Storage.removeProduct(999);
        expect(Storage.getProducts).toHaveLength(1);
    });

    describe("removeCategory", () => {
        test("removes the category by id", () => {
            Storage.saveCategories([
                { id: 1, title: "Food" },
                { id: 2, title: "Tools" }
            ]);
            Storage.removeCategory(1);
            expect(Storage.getCategories()).toEqual([{ id: 2, title: "Tools" }]);
        });

        test("matches numeric and string ids interchangeably", () => {
            Storage.saveCategories([{ id: "abc-123", title: "Food" }]);
            Storage.removeCategory("abc-123");
            expect(Storage.getCategories()).toEqual([]);
        });

        test("returns 0 when no products reference the deleted category", () => {
            Storage.saveCategories([{ id: 1, title: "Food" }]);
            Storage.saveProducts([{ id: 1, title: "A", category: "Tools" }]);
            const reassigned = Storage.removeCategory(1);
            expect(reassigned).toBe(0);
            expect(Storage.getProducts[0].category).toBe("Tools");
        });

        test("reassigns orphaned products to 'none' and returns the count", () => {
            Storage.saveCategories([{ id: 1, title: "Food" }]);
            Storage.saveProducts([
                { id: 1, title: "Apple",  category: "Food" },
                { id: 2, title: "Banana", category: "Food" },
                { id: 3, title: "Hammer", category: "Tools" }
            ]);
            const reassigned = Storage.removeCategory(1);
            expect(reassigned).toBe(2);
            const cats = Storage.getProducts.map((p) => p.category);
            expect(cats).toEqual(["none", "none", "Tools"]);
        });

        test("returns 0 and does not touch products when category id is unknown", () => {
            Storage.saveCategories([{ id: 1, title: "Food" }]);
            Storage.saveProducts([{ id: 1, title: "Apple", category: "Food" }]);
            const reassigned = Storage.removeCategory(999);
            expect(reassigned).toBe(0);
            expect(Storage.getProducts[0].category).toBe("Food");
        });
    });
});
