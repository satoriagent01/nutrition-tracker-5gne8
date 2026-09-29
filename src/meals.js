/**
 * Meal planning with custom gram amounts and nutrition calculation.
 *
 * @param {string} mealId - The meal identifier
 * @param {string} productId - The product identifier
 * @param {number} grams - The amount in grams
 * @param {object} meals - Meals object with { "mealId": { items: [] } }
 * @param {object} storage - Storage object with { products: [] }
 */
export function addMealItem(mealId, productId, grams, meals, storage) {
  if (!meals[mealId]) {
    meals[mealId] = { items: [] };
  }

  meals[mealId].items.push({
    productId,
    grams,
  });
}

/**
 * Calculates total nutrition for a meal based on gram amounts.
 *
 * @param {string} mealId - The meal identifier
 * @param {object} meals - Meals object with { "mealId": { items: [{ productId, grams }] } }
 * @param {object} products - Products lookup object { "productId": { calories, fats, ... } }
 * @returns {object} Total nutrition for the meal
 */
export function calculateMealNutrition(mealId, meals, products) {
  const meal = meals[mealId];
  if (!meal || !meal.items || meal.items.length === 0) {
    return {
      calories: 0,
      fats: 0,
      saturatedFats: 0,
      sodium: 0,
      carbs: 0,
      sugars: 0,
      proteins: 0,
    };
  }

  const total = {
    calories: 0,
    fats: 0,
    saturatedFats: 0,
    sodium: 0,
    carbs: 0,
    sugars: 0,
    proteins: 0,
  };

  for (const item of meal.items) {
    const product = products[item.productId];
    if (product) {
      const factor = item.grams / 100;
      total.calories += (product.calories || 0) * factor;
      total.fats += (product.fats || 0) * factor;
      total.saturatedFats += (product.saturatedFats || 0) * factor;
      total.sodium += (product.sodium || 0) * factor;
      total.carbs += (product.carbs || 0) * factor;
      total.sugars += (product.sugars || 0) * factor;
      total.proteins += (product.proteins || 0) * factor;
    }
  }

  return total;
}