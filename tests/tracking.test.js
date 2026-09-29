import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { addDayNutrition, getDayNutrition } from "../src/tracking.js";

describe("addDayNutrition", () => {
  test("AC-4: adds nutrition data for a specific date", () => {
    const tracking = {};
    const date = "2024-01-15";
    const nutrition = {
      calories: 500,
      fats: 25,
      saturatedFats: 10,
      sodium: 200,
      carbs: 50,
      sugars: 20,
      proteins: 15,
    };

    addDayNutrition(date, nutrition, tracking);

    assert.ok(tracking[date], "Should have entry for the date");
    assert.strictEqual(tracking[date].calories, 500, "Calories should match");
    assert.strictEqual(tracking[date].fats, 25, "Fats should match");
    assert.strictEqual(tracking[date].saturatedFats, 10, "Saturated fats should match");
    assert.strictEqual(tracking[date].sodium, 200, "Sodium should match");
    assert.strictEqual(tracking[date].carbs, 50, "Carbs should match");
    assert.strictEqual(tracking[date].sugars, 20, "Sugars should match");
    assert.strictEqual(tracking[date].proteins, 15, "Proteins should match");
  });

  test("AC-4: adds nutrition data for multiple dates", () => {
    const tracking = {};

    addDayNutrition("2024-01-15", { calories: 500, fats: 25, saturatedFats: 10, sodium: 200, carbs: 50, sugars: 20, proteins: 15 }, tracking);
    addDayNutrition("2024-01-16", { calories: 600, fats: 30, saturatedFats: 12, sodium: 250, carbs: 60, sugars: 25, proteins: 20 }, tracking);

    assert.ok(tracking["2024-01-15"], "Should have entry for 2024-01-15");
    assert.ok(tracking["2024-01-16"], "Should have entry for 2024-01-16");
    assert.strictEqual(tracking["2024-01-15"].calories, 500, "Calories for 2024-01-15 should match");
    assert.strictEqual(tracking["2024-01-16"].calories, 600, "Calories for 2024-01-16 should match");
  });
});

describe("getDayNutrition", () => {
  test("AC-4: retrieves nutrition data for a specific date", () => {
    const tracking = {
      "2024-01-15": {
        calories: 500,
        fats: 25,
        saturatedFats: 10,
        sodium: 200,
        carbs: 50,
        sugars: 20,
        proteins: 15,
      },
    };

    const nutrition = getDayNutrition("2024-01-15", tracking);

    assert.strictEqual(nutrition.calories, 500, "Calories should match");
    assert.strictEqual(nutrition.fats, 25, "Fats should match");
    assert.strictEqual(nutrition.saturatedFats, 10, "Saturated fats should match");
    assert.strictEqual(nutrition.sodium, 200, "Sodium should match");
    assert.strictEqual(nutrition.carbs, 50, "Carbs should match");
    assert.strictEqual(nutrition.sugars, 20, "Sugars should match");
    assert.strictEqual(nutrition.proteins, 15, "Proteins should match");
  });

  test("AC-4: returns undefined for non-existent date", () => {
    const tracking = {
      "2024-01-15": {
        calories: 500,
        fats: 25,
        saturatedFats: 10,
        sodium: 200,
        carbs: 50,
        sugars: 20,
        proteins: 15,
      },
    };

    const nutrition = getDayNutrition("2024-01-16", tracking);

    assert.strictEqual(nutrition, undefined, "Should return undefined for non-existent date");
  });
});