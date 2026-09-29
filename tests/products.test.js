import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { saveProduct, getProducts } from "../src/products.js";

describe("saveProduct", () => {
  test("AC-2: saves a product to storage", () => {
    const storage = { products: [] };
    const product = {
      id: "product-1",
      name: "Test Product",
      calories: 200,
      fats: 10,
      saturatedFats: 5,
      sodium: 100,
      carbs: 20,
      sugars: 8,
      proteins: 5,
    };

    saveProduct(product, storage);

    assert.strictEqual(storage.products.length, 1, "Should have one product in storage");
    assert.strictEqual(storage.products[0].name, "Test Product", "Product name should match");
  });

  test("AC-2: generates a unique ID for the product", () => {
    const storage = { products: [] };
    const product = {
      name: "Test Product 2",
      calories: 150,
      fats: 5,
      saturatedFats: 2,
      sodium: 50,
      carbs: 15,
      sugars: 5,
      proteins: 3,
    };

    saveProduct(product, storage);

    assert.ok(storage.products[0].id, "Product should have an ID");
    assert.strictEqual(typeof storage.products[0].id, "string", "ID should be a string");
  });
});

describe("getProducts", () => {
  test("AC-2: retrieves all products from storage", () => {
    const storage = {
      products: [
        { id: "product-1", name: "Product 1", calories: 200 },
        { id: "product-2", name: "Product 2", calories: 300 },
      ],
    };

    const products = getProducts(storage);

    assert.strictEqual(products.length, 2, "Should return all products");
    assert.strictEqual(products[0].name, "Product 1", "First product name should match");
    assert.strictEqual(products[1].name, "Product 2", "Second product name should match");
  });

  test("AC-2: returns empty array when no products exist", () => {
    const storage = { products: [] };

    const products = getProducts(storage);

    assert.strictEqual(products.length, 0, "Should return empty array");
  });
});