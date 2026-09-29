/**
 * Daily tracking that aggregates nutrition totals.
 *
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {object} nutrition - Nutrition data object
 * @param {object} tracking - Tracking object (mutated in place)
 * @returns {object} The tracking object (for chaining)
 */
export function addDayNutrition(date, nutrition, tracking) {
  if (!tracking[date]) {
    tracking[date] = {
      calories: 0,
      fats: 0,
      saturatedFats: 0,
      sodium: 0,
      carbs: 0,
      sugars: 0,
      proteins: 0,
    };
  }

  // Add the nutrition values to the existing day totals
  tracking[date].calories += nutrition.calories || 0;
  tracking[date].fats += nutrition.fats || 0;
  tracking[date].saturatedFats += nutrition.saturatedFats || 0;
  tracking[date].sodium += nutrition.sodium || 0;
  tracking[date].carbs += nutrition.carbs || 0;
  tracking[date].sugars += nutrition.sugars || 0;
  tracking[date].proteins += nutrition.proteins || 0;

  return tracking;
}

/**
 * Retrieves nutrition data for a specific date.
 *
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {object} tracking - Tracking object
 * @returns {object|undefined} Nutrition data for the date, or undefined
 */
export function getDayNutrition(date, tracking) {
  if (tracking[date]) {
    return { ...tracking[date] };
  }
  return undefined;
}