import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { addMealItem, calculateMealNutrition } from "../src/meals.js";

describe("addMealItem", () => {
  test("AC-3: adds a meal item with custom gram amount", () => {
    const meals = { "meal-1": { items: [] } };
    const storage = { products: [] };
    const productId = "product-1";

    addMealItem("meal-1", productId, 100, meals, storage);

    assert.strictEqual(meals["meal-1"].items.length, 1, "Should have one item in the meal");
    assert.strictEqual(meals["meal-1"].items[0].productId, productId, "Product ID should match");
    assert.strictEqual(meals["meal-1"].items[0].grams, 100, "Grams should match");
  });

  test("AC-3: adds multiple items to the same meal", () => {
    const meals = { "meal-1": { items: [] } };
    const storage = { products: [] };

    addMealItem("meal-1", "product-1", 50, meals, storage);
    addMealItem("meal-1", "product-2", 75, meals, storage);

    assert.strictEqual(meals["meal-1"].items.length, 2, "Should have two items in the meal");
  });
});

describe("calculateMealNutrition", () => {
  test("AC-3: calculates nutrition based on gram amounts", () => {
    const products = {
      "product-1": {
        id: "product-1",
        name: "Test Product",
        calories: 200,
        fats: 10,
        saturatedFats: 5,
        sodium: 100,
        carbs: 20,
        sugars: 8,
        proteins: 5,
      },
    };
    const meals = {
      "meal-1": {
        items: [
          { productId: "product-1", grams: 100 },
        ],
      },
    };

    const nutrition = calculateMealNutrition("meal-1", meals, products);

    assert.strictEqual(nutrition.calories, 200, "Calories should be 200 for 100g");
    assert.strictEqual(nutrition.fats, 10, "Fats should be 10 for 100g");
    assert.strictEqual(nutrition.saturatedFats, 5, "Saturated fats should be 5 for 100g");
    assert.strictEqual(nutrition.sodium, 100, "Sodium should be 100 for 100g");
    assert.strictEqual(nutrition.carbs, 20, "Carbs should be 20 for 100g");
    assert.strictEqual(nutrition.sugars, 8, "Sugars should be 8 for 100g");
    assert.strictEqual(nutrition.proteins, 5, "Proteins should be 5 for 100g");
  });

  test("AC-3: calculates nutrition for partial servings", () => {
    const products = {
      "product-1": {
        id: "product-1",
        name: "Test Product",
        calories: 200,
        fats: 10,
        saturatedFats: 5,
        sodium: 100,
        carbs: 20,
        sugars: 8,
        proteins: 5,
      },
    };
    const meals = {
      "meal-1": {
        items: [
          { productId: "product-1", grams: 50 },
        ],
      },
    };

    const nutrition = calculateMealNutrition("meal-1", meals, products);

    assert.strictEqual(nutrition.calories, 100, "Calories should be 100 for 50g");
    assert.strictEqual(nutrition.fats, 5, "Fats should be 5 for 50g");
    assert.strictEqual(nutrition.saturatedFats, 2.5, "Saturated fats should be 2.5 for 50g");
    assert.strictEqual(nutrition.sodium, 50, "Sodium should be 50 for 50g");
    assert.strictEqual(nutrition.carbs, 10, "Carbs should be 10 for 50g");
    assert.strictEqual(nutrition.sugars, 4, "Sugars should be 4 for 50g");
    assert.strictEqual(nutrition.proteins, 2.5, "Proteins should be 2.5 for 50g");
  });

  test("AC-3: calculates nutrition for multiple items", () => {
    const products = {
      "product-1": {
        id: "product-1",
        name: "Product 1",
        calories: 200,
        fats: 10,
        saturatedFats: 5,
        sodium: 100,
        carbs: 20,
        sugars: 8,
        proteins: 5,
      },
      "product-2": {
        id: "product-2",
        name: "Product 2",
        calories: 300,
        fats: 15,
        saturatedFats: 7,
        sodium: 150,
        carbs: 30,
        sugars: 12,
        proteins: 8,
      },
    };
    const meals = {
      "meal-1": {
        items: [
          { productId: "product-1", grams: 100 },
          { productId: "product-2", grams: 50 },
        ],
      },
    };

    const nutrition = calculateMealNutrition("meal-1", meals, products);

    assert.strictEqual(nutrition.calories, 350, "Total calories should be 350");
    assert.strictEqual(nutrition.fats, 17.5, "Total fats should be 17.5");
    assert.strictEqual(nutrition.saturatedFats, 8.5, "Total saturated fats should be 8.5");
    assert.strictEqual(nutrition.sodium, 175, "Total sodium should be 175");
    assert.strictEqual(nutrition.carbs, 35, "Total carbs should be 35");
    assert.strictEqual(nutrition.sugars, 14, "Total sugars should be 14");
    assert.strictEqual(nutrition.proteins, 9, "Total proteins should be 9");
  });
});