// Nutrition Tracker - Client-side JavaScript
// Uses localStorage for persistence

// Storage helpers
function getStorage() {
  const data = localStorage.getItem('nutritionTracker');
  if (data) return JSON.parse(data);
  return { products: [], meals: {}, tracking: {} };
}

function saveStorage(storage) {
  localStorage.setItem('nutritionTracker', JSON.stringify(storage));
}

// AI Configuration
function saveConfig() {
  const config = {
    apiUrl: document.getElementById('apiUrl').value,
    apiKey: document.getElementById('apiKey').value,
    model: document.getElementById('model').value,
  };
  localStorage.setItem('nutritionConfig', JSON.stringify(config));
  alert('Configuration saved!');
}

function loadConfig() {
  const data = localStorage.getItem('nutritionConfig');
  if (data) {
    const config = JSON.parse(data);
    document.getElementById('apiUrl').value = config.apiUrl || '';
    document.getElementById('apiKey').value = config.apiKey || '';
    document.getElementById('model').value = config.model || '';
  }
}

// Tab navigation
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  event.target.classList.add('active');
  
  if (sectionId === 'products') renderProducts();
  if (sectionId === 'meals') { renderMeals(); updateMealSelects(); }
  if (sectionId === 'tracking') { loadDayTracking(); updateMealTrackingSelect(); }
}

// Image scanning
async function scanImage() {
  const fileInput = document.getElementById('imageInput');
  const configEl = localStorage.getItem('nutritionConfig');
  
  if (!configEl) {
    alert('Please configure your AI API first!');
    return;
  }
  
  if (!fileInput.files[0]) {
    alert('Please select an image!');
    return;
  }
  
  const config = JSON.parse(configEl);
  const reader = new FileReader();
  
  reader.onload = async function(e) {
    const imageData = {
      type: 'image',
      content: e.target.result.split(',')[1] // base64 without data URI prefix
    };
    
    const resultDiv = document.getElementById('scanResult');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<div class="loading">Scanning nutrition label...</div>';
    
    try {
      const response = await fetch(`${config.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract nutrition information from this label. Return a JSON object with: name (string), calories (number per 100g), fats (number per 100g), saturatedFats (number per 100g), sodium (number per 100g in mg), carbs (number per 100g), sugars (number per 100g), proteins (number per 100g). Only return valid JSON.' },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageData.content}` } }
              ]
            }
          ],
          max_tokens: 500
        })
      });
      
      const data = await response.json();
      const text = data.choices[0].message.content;
      
      // Parse the JSON from the response
      let nutrition;
      try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          nutrition = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (parseErr) {
        resultDiv.innerHTML = `<div class="error">Could not parse nutrition data. Raw response: ${text}</div>`;
        return;
      }
      
      // Save the product
      const storage = getStorage();
      const product = {
        id: 'product-' + Date.now(),
        name: document.getElementById('productName').value || nutrition.name || 'Scanned Product',
        calories: nutrition.calories || 0,
        fats: nutrition.fats || 0,
        saturatedFats: nutrition.saturatedFats || 0,
        sodium: nutrition.sodium || 0,
        carbs: nutrition.carbs || 0,
        sugars: nutrition.sugars || 0,
        proteins: nutrition.proteins || 0,
      };
      
      storage.products.push(product);
      saveStorage(storage);
      
      resultDiv.innerHTML = `
        <div class="success">Product saved: ${product.name}</div>
        <div class="nutrient-grid">
          <div class="nutrient-item"><div class="value">${product.calories}</div><div class="label">Calories</div></div>
          <div class="nutrient-item"><div class="value">${product.fats}g</div><div class="label">Fats</div></div>
          <div class="nutrient-item"><div class="value">${product.saturatedFats}g</div><div class="label">Sat. Fats</div></div>
          <div class="nutrient-item"><div class="value">${product.sodium}mg</div><div class="label">Sodium</div></div>
          <div class="nutrient-item"><div class="value">${product.carbs}g</div><div class="label">Carbs</div></div>
          <div class="nutrient-item"><div class="value">${product.sugars}g</div><div class="label">Sugars</div></div>
          <div class="nutrient-item"><div class="value">${product.proteins}g</div><div class="label">Proteins</div></div>
        </div>
      `;
      
      // Clear file input
      fileInput.value = '';
      
    } catch (err) {
      resultDiv.innerHTML = `<div class="error">Error scanning image: ${err.message}</div>`;
    }
  };
  
  reader.readAsDataURL(fileInput.files[0]);
}

// Products
function renderProducts() {
  const storage = getStorage();
  const container = document.getElementById('productsList');
  
  if (storage.products.length === 0) {
    container.innerHTML = '<p style="color: #666;">No products yet. Scan a nutrition label to add one!</p>';
    return;
  }
  
  container.innerHTML = storage.products.map(p => `
    <div class="product-item">
      <div>
        <strong>${p.name}</strong>
        <div style="font-size: 12px; color: #666;">
          ${p.calories} cal | ${p.fats}g fat | ${p.carbs}g carbs | ${p.proteins}g protein
        </div>
      </div>
      <button class="secondary" onclick="deleteProduct('${p.id}')">Delete</button>
    </div>
  `).join('');
}

function deleteProduct(id) {
  const storage = getStorage();
  storage.products = storage.products.filter(p => p.id !== id);
  saveStorage(storage);
  renderProducts();
}

// Meals
function createMeal() {
  const name = document.getElementById('mealName').value.trim();
  if (!name) {
    alert('Please enter a meal name!');
    return;
  }
  
  const storage = getStorage();
  const mealId = 'meal-' + Date.now();
  storage.meals[mealId] = { name, items: [] };
  saveStorage(storage);
  
  document.getElementById('mealName').value = '';
  renderMeals();
  updateMealSelects();
}

function renderMeals() {
  const storage = getStorage();
  const container = document.getElementById('mealsList');
  
  if (Object.keys(storage.meals).length === 0) {
    container.innerHTML = '<p style="color: #666;">No meals yet. Create one above!</p>';
    return;
  }
  
  container.innerHTML = Object.entries(storage.meals).map(([id, meal]) => `
    <div class="meal-entry">
      <h4>${meal.name} <span class="badge">${meal.items.length} items</span></h4>
      ${meal.items.map(item => {
        const product = storage.products.find(p => p.id === item.productId);
        return product ? `<div class="meal-item"><span>${product.name} (${item.grams}g)</span></div>` : '';
      }).join('')}
      <div style="margin-top: 8px;">
        <button onclick="calculateMealNutrition('${id}')" style="font-size: 12px;">Calculate Nutrition</button>
      </div>
      <div id="mealNutrition-${id}" class="hidden"></div>
    </div>
  `).join('');
}

function updateMealSelects() {
  const storage = getStorage();
  
  // Meal select for adding items
  const mealSelect = document.getElementById('mealSelect');
  mealSelect.innerHTML = Object.entries(storage.meals)
    .map(([id, meal]) => `<option value="${id}">${meal.name}</option>`)
    .join('');
  
  // Product select
  const productSelect = document.getElementById('productSelect');
  productSelect.innerHTML = storage.products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  
  // Meal tracking select
  updateMealTrackingSelect();
}

function updateMealTrackingSelect() {
  const storage = getStorage();
  const select = document.getElementById('mealTrackingSelect');
  select.innerHTML = Object.entries(storage.meals)
    .map(([id, meal]) => `<option value="${id}">${meal.name}</option>`)
    .join('');
}

function addMealItem() {
  const mealId = document.getElementById('mealSelect').value;
  const productId = document.getElementById('productSelect').value;
  const grams = parseInt(document.getElementById('gramsInput').value) || 100;
  
  if (!mealId || !productId) {
    alert('Please select a meal and a product!');
    return;
  }
  
  const storage = getStorage();
  if (!storage.meals[mealId]) return;
  
  storage.meals[mealId].items.push({ productId, grams });
  saveStorage(storage);
  
  renderMeals();
  alert('Item added to meal!');
}

function calculateMealNutrition(mealId) {
  const storage = getStorage();
  const meal = storage.meals[mealId];
  if (!meal) return;
  
  let total = { calories: 0, fats: 0, saturatedFats: 0, sodium: 0, carbs: 0, sugars: 0, proteins: 0 };
  
  meal.items.forEach(item => {
    const product = storage.products.find(p => p.id === item.productId);
    if (product) {
      const factor = item.grams / 100;
      total.calories += product.calories * factor;
      total.fats += product.fats * factor;
      total.saturatedFats += product.saturatedFats * factor;
      total.sodium += product.sodium * factor;
      total.carbs += product.carbs * factor;
      total.sugars += product.sugars * factor;
      total.proteins += product.proteins * factor;
    }
  });
  
  const resultDiv = document.getElementById(`mealNutrition-${mealId}`);
  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = `
    <div class="nutrient-grid" style="margin-top: 8px;">
      <div class="nutrient-item"><div class="value">${Math.round(total.calories)}</div><div class="label">Calories</div></div>
      <div class="nutrient-item"><div class="value">${total.fats.toFixed(1)}g</div><div class="label">Fats</div></div>
      <div class="nutrient-item"><div class="value">${total.saturatedFats.toFixed(1)}g</div><div class="label">Sat. Fats</div></div>
      <div class="nutrient-item"><div class="value">${total.sodium.toFixed(0)}mg</div><div class="label">Sodium</div></div>
      <div class="nutrient-item"><div class="value">${total.carbs.toFixed(1)}g</div><div class="label">Carbs</div></div>
      <div class="nutrient-item"><div class="value">${total.sugars.toFixed(1)}g</div><div class="label">Sugars</div></div>
      <div class="nutrient-item"><div class="value">${total.proteins.toFixed(1)}g</div><div class="label">Proteins</div></div>
    </div>
  `;
}

// Tracking
function changeDate(delta) {
  const input = document.getElementById('trackingDate');
  const date = new Date(input.value);
  date.setDate(date.getDate() + delta);
  input.value = date.toISOString().split('T')[0];
  loadDayTracking();
}

function loadDayTracking() {
  const date = document.getElementById('trackingDate').value;
  if (!date) return;
  
  const storage = getStorage();
  const dayData = storage.tracking[date];
  const container = document.getElementById('dayNutrition');
  
  if (!dayData) {
    container.innerHTML = '<p style="color: #666;">No data for this date.</p>';
    return;
  }
  
  container.innerHTML = `
    <div class="nutrient-grid">
      <div class="nutrient-item"><div class="value">${dayData.calories}</div><div class="label">Calories</div></div>
      <div class="nutrient-item"><div class="value">${dayData.fats.toFixed(1)}g</div><div class="label">Fats</div></div>
      <div class="nutrient-item"><div class="value">${dayData.saturatedFats.toFixed(1)}g</div><div class="label">Sat. Fats</div></div>
      <div class="nutrient-item"><div class="value">${dayData.sodium.toFixed(0)}mg</div><div class="label">Sodium</div></div>
      <div class="nutrient-item"><div class="value">${dayData.carbs.toFixed(1)}g</div><div class="label">Carbs</div></div>
      <div class="nutrient-item"><div class="value">${dayData.sugars.toFixed(1)}g</div><div class="label">Sugars</div></div>
      <div class="nutrient-item"><div class="value">${dayData.proteins.toFixed(1)}g</div><div class="label">Proteins</div></div>
    </div>
  `;
}

function addMealToDay() {
  const mealId = document.getElementById('mealTrackingSelect').value;
  const date = document.getElementById('trackingDate').value;
  
  if (!mealId || !date) {
    alert('Please select a meal and date!');
    return;
  }
  
  const storage = getStorage();
  const meal = storage.meals[mealId];
  if (!meal) return;
  
  // Calculate meal nutrition
  let total = { calories: 0, fats: 0, saturatedFats: 0, sodium: 0, carbs: 0, sugars: 0, proteins: 0 };
  
  meal.items.forEach(item => {
    const product = storage.products.find(p => p.id === item.productId);
    if (product) {
      const factor = item.grams / 100;
      total.calories += product.calories * factor;
      total.fats += product.fats * factor;
      total.saturatedFats += product.saturatedFats * factor;
      total.sodium += product.sodium * factor;
      total.carbs += product.carbs * factor;
      total.sugars += product.sugars * factor;
      total.proteins += product.proteins * factor;
    }
  });
  
  // Add to tracking (aggregate)
  if (!storage.tracking[date]) {
    storage.tracking[date] = { calories: 0, fats: 0, saturatedFats: 0, sodium: 0, carbs: 0, sugars: 0, proteins: 0 };
  }
  
  storage.tracking[date].calories += total.calories;
  storage.tracking[date].fats += total.fats;
  storage.tracking[date].saturatedFats += total.saturatedFats;
  storage.tracking[date].sodium += total.sodium;
  storage.tracking[date].carbs += total.carbs;
  storage.tracking[date].sugars += total.sugars;
  storage.tracking[date].proteins += total.proteins;
  
  saveStorage(storage);
  loadDayTracking();
  alert('Meal added to daily tracking!');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  document.getElementById('trackingDate').value = new Date().toISOString().split('T')[0];
});