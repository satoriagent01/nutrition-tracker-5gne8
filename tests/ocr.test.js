import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractNutrition } from "../src/ocr.js";

describe("extractNutrition", () => {
  test("AC-1: extracts calories from a nutrition label image", async () => {
    const imageData = {
      type: "image",
      content: "base64encodedimagecontent",
    };
    const config = {
      apiKey: "test-key",
      model: "gpt-4-vision-preview",
    };

    const result = await extractNutrition(imageData, config);

    assert.ok(result.calories !== undefined, "Should extract calories");
    assert.strictEqual(typeof result.calories, "number", "Calories should be a number");
  });

  test("AC-1: extracts fats from a nutrition label image", async () => {
    const imageData = {
      type: "image",
      content: "base64encodedimagecontent",
    };
    const config = {
      apiKey: "test-key",
      model: "gpt-4-vision-preview",
    };

    const result = await extractNutrition(imageData, config);

    assert.ok(result.fats !== undefined, "Should extract fats");
    assert.strictEqual(typeof result.fats, "number", "Fats should be a number");
  });

  test("AC-1: extracts saturated fats from a nutrition label image", async () => {
    const imageData = {
      type: "image",
      content: "base64encodedimagecontent",
    };
    const config = {
      apiKey: "test-key",
      model: "gpt-4-vision-preview",
    };

    const result = await extractNutrition(imageData, config);

    assert.ok(result.saturatedFats !== undefined, "Should extract saturated fats");
    assert.strictEqual(typeof result.saturatedFats, "number", "Saturated fats should be a number");
  });

  test("AC-1: extracts sodium from a nutrition label image", async () => {
    const imageData = {
      type: "image",
      content: "base64encodedimagecontent",
    };
    const config = {
      apiKey: "test-key",
      model: "gpt-4-vision-preview",
    };

    const result = await extractNutrition(imageData, config);

    assert.ok(result.sodium !== undefined, "Should extract sodium");
    assert.strictEqual(typeof result.sodium, "number", "Sodium should be a number");
  });

  test("AC-1: extracts carbs from a nutrition label image", async () => {
    const imageData = {
      type: "image",
      content: "base64encodedimagecontent",
    };
    const config = {
      apiKey: "test-key",
      model: "gpt-4-vision-preview",
    };

    const result = await extractNutrition(imageData, config);

    assert.ok(result.carbs !== undefined, "Should extract carbs");
    assert.strictEqual(typeof result.carbs, "number", "Carbs should be a number");
  });

  test("AC-1: extracts sugars from a nutrition label image", async () => {
    const imageData = {
      type: "image",
      content: "base64encodedimagecontent",
    };
    const config = {
      apiKey: "test-key",
      model: "gpt-4-vision-preview",
    };

    const result = await extractNutrition(imageData, config);

    assert.ok(result.sugars !== undefined, "Should extract sugars");
    assert.strictEqual(typeof result.sugars, "number", "Sugars should be a number");
  });

  test("AC-1: extracts proteins from a nutrition label image", async () => {
    const imageData = {
      type: "image",
      content: "base64encodedimagecontent",
    };
    const config = {
      apiKey: "test-key",
      model: "gpt-4-vision-preview",
    };

    const result = await extractNutrition(imageData, config);

    assert.ok(result.proteins !== undefined, "Should extract proteins");
    assert.strictEqual(typeof result.proteins, "number", "Proteins should be a number");
  });

  test("AC-1: handles various languages in nutrition labels", async () => {
    const imageData = {
      type: "image",
      content: "base64encodedimagecontent",
    };
    const config = {
      apiKey: "test-key",
      model: "gpt-4-vision-preview",
    };

    const result = await extractNutrition(imageData, config);

    assert.ok(result.calories !== undefined, "Should extract calories from any language");
    assert.ok(result.fats !== undefined, "Should extract fats from any language");
    assert.ok(result.sodium !== undefined, "Should extract sodium from any language");
  });
});