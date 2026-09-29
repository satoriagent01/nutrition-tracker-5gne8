# Nutrition Tracker - Specification

## Overview
A free, ad-free web application that allows users to:
1. Take/upload photos of nutrition labels from food products
2. Use OCR with AI to extract nutrition information from the photos
3. Store extracted products in a personal database
4. Create custom meal plans by adding products with custom gram amounts
5. Track daily intake of various nutrients (calories, sodium, saturated fats, etc.) based on meals
6. Simple, focused UI for nutrition tracking

## Stack
- **Runtime**: Node 24 with ES modules
- **Testing**: Node's built-in test runner (`node --test`)
- **Build**: No build step
- **UI**: Static web page in `public/`
- **AI/OCR**: OpenAI-compatible endpoint (user-configured via UI)
- **Storage**: localStorage (browser) / in-memory (tests)

## Examples from Shared Images

### Image 1 (1.jpg) - Chocolate Bar (Multilingual: German, French, Dutch, Italian)
- **Product**: Dr. Schär chocolate wafers
- **Nutrition table columns**: Per 100g and Per 30g (1 Melto)
- **Nutrients extracted**:
  - Energie: 2292 kJ / 549 kcal (per 100g), 688 kJ / 165 kcal (per 30g)
  - Fett: 33g (per 100g), 10g (per 30g)
  - Davon gesättigte Fettsäuren: 13g (per 100g), 3.9g (per 30g)
  - Kohlenhydrate: 55g (per 100g), 16g (per 30g)
  - Davon Zucker: 45g (per 100g), 14g (per 30g)
  - Ballaststoffe: 2.4g (per 100g), 0.7g (per 30g)
  - Eiweiß: 6.8g (per 100g), 2.0g (per 30g)
  - Salz: 0.18g (per 100g), 0.05g (per 30g)

### Image 2 (2.jpg) - Apple-Orange-Mango Juice (Dutch)
- **Product**: Versgeperst appel-sinaasappel- en mangosap
- **Volume**: 1L / 5 porties (200ml)
- **Nutrition table columns**: Per 100ml and Per glas (200ml)
- **Nutrients extracted**:
  - Energie: 199 kJ / 47 kcal (per 100ml), 399 kJ / 94 kcal (per 200ml)
  - Vetten: 0g (per 100ml), 0g (per 200ml)
  - Koolhydraten: 11g (per 100ml), 22g (per 200ml)
  - Waarvan suikers: 10g (per 100ml), 20g (per 200ml)
  - Waarvan vezels: 0.7g (per 100ml), 1.4g (per 200ml)
  - Waarvan eiwitten: 0.4g (per 100ml), 0.8g (per 200ml)
  - Zout: 0g (per 100ml), 0g (per 200ml)

### Image 3 (3.jpg) - Extra Virgin Olive Oil Spray (Dutch)
- **Product**: Extra olijfolie van de eerste persing
- **Volume**: 200ml
- **Nutrition table**: Per 100ml
- **Nutrients extracted**:
  - Energie: 3404 kJ / 828 kcal (per 100ml)
  - Vetten: 92g (per 100ml)
  - Waarvan verzadigde vetzuren: 14g (per 100ml)
  - Koolhydraten: 0g (per 100ml)
  - Waarvan suikers: 0g (per 100ml)
  - Waarvan vezels: 0g (per 100ml)
  - Waarvan eiwitten: 0g (per 100ml)
  - Zout: 0g (per 100ml)

## Acceptance Criteria

### AC-1: Photo Upload and Capture
- Users can upload photos from their device
- Users can take photos using the device camera (mobile-friendly)
- Supported formats: JPEG, PNG

### AC-2: OCR with AI Extraction
- Users can configure their OpenAI-compatible endpoint (URL, API key, model name) in the UI
- The app sends the photo to the configured endpoint for OCR extraction
- The app extracts nutrition information including: energy (kJ and kcal), fats, saturated fats, carbohydrates, sugars, fiber, protein, sodium/salt
- The app handles multiple languages (German, Dutch, French, Italian, English, etc.)
- The OCR extraction is configurable and does not hardcode any specific API endpoint

### AC-3: Product Storage
- Extracted products are stored in the user's personal database (localStorage in browser)
- Each product stores: name, nutrition values per 100g (or per serving), serving size information
- Users can view their saved products list

### AC-4: Meal Planning
- Users can create meals by adding products with custom gram amounts
- Users can specify the amount in grams for each product in a meal
- The app calculates nutrition values based on the specified gram amount

### AC-5: Daily Nutrition Tracking
- Users can view their daily intake of various nutrients
- The app aggregates nutrition values from all meals in a day
- Users can track: calories (kJ and kcal), fats, saturated fats, carbohydrates, sugars, fiber, protein, sodium/salt
- Users can view tracking by date

### AC-6: Free and Ad-Free
- The application is free to use
- No advertisements in the UI

### AC-7: Simple, Focused UI
- The UI is clean and focused on nutrition tracking
- Easy navigation between product scanning, meal planning, and daily tracking views

## Modules

### src/ocr.js
**Purpose**: Handles OCR extraction using OpenAI-compatible API

**Exports**:
- `extractNutrition(imageData, config)` - Extracts nutrition information from an image
  - **Parameters**:
    - `imageData`: Base64-encoded image data (string)
    - `config`: Object with `url`, `key`, `model` (strings)
  - **Returns**: Object with nutrition values
  - **Example**:
    ```javascript
    // Input:
    const imageData = "data:image/jpeg;base64,/9j/4AAQSkZJRg...";
    const config = { url: "https://api.openai.com/v1", key: "sk-...", model: "gpt-4o" };
    
    // Output:
    {
      name: "Dr. Schär Vollmilchschokolade",
      per100g: {
        energyKj: 2292,
        energyKcal: 549,
        fat: 33,
        saturatedFat: 13,
        carbohydrates: 55,
        sugars: 45,
        fiber: 2.4,
        protein: 6.8,
        sodium: 0.18
      }
    }
    ```

### src/products.js
**Purpose**: Manages product storage and retrieval

**Exports**:
- `saveProduct(product, storage)` - Saves a product to storage
  - **Parameters**:
    - `product`: Object with product data (name, per100g nutrition values, etc.)
    - `storage`: Object with `get(key)` and `set(key, value)` methods
  - **Returns**: Boolean (success)
  - **Example**:
    ```javascript
    // Input:
    const product = {
      id: "prod-001",
      name: "Dr. Schär Vollmilchschokolade",
      per100g: {
        energyKj: 2292,
        energyKcal: 549,
        fat: 33,
        saturatedFat: 13,
        carbohydrates: 55,
        sugars: 45,
        fiber: 2.4,
        protein: 6.8,
        sodium: 0.18
      }
    };
    const storage = {
      get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
      set: (key, value) => localStorage.setItem(key, JSON.stringify(value))
    };
    
    // Output: true
    ```

- `getProducts(storage)` - Retrieves all saved products
  - **Parameters**:
    - `storage`: Object with `get(key)` and `set(key, value)` methods
  - **Returns**: Array of product objects
  - **Example**:
    ```javascript
    // Output:
    [
      {
        id: "prod-001",
        name: "Dr. Schär Vollmilchschokolade",
        per100g: {
          energyKj: 2292,
          energyKcal: 549,
          fat: 33,
          saturatedFat: 13,
          carbohydrates: 55,
          sugars: 45,
          fiber: 2.4,
          protein: 6.8,
          sodium: 0.18
        }
      }
    ]
    ```

### src/meals.js
**Purpose**: Manages meal planning and nutrition calculation

**Exports**:
- `addMealItem(mealId, productId, grams, meals, storage)` - Adds a product to a meal
  - **Parameters**:
    - `mealId`: String (meal identifier)
    - `productId`: String (product identifier)
    - `grams`: Number (amount in grams)
    - `meals`: Object with meal data
    - `storage`: Object with `get(key)` and `set(key, value)` methods
  - **Returns**: Updated meals object
  - **Example**:
    ```javascript
    // Input:
    const mealId = "meal-001";
    const productId = "prod-001";
    const grams = 30;
    const meals = { "meal-001": [] };
    const storage = {
      get: (key) => JSON.parse(localStorage.getItem(key) || '{}'),
      set: (key, value) => localStorage.setItem(key, JSON.stringify(value))
    };
    
    // Output:
    {
      "meal-001": [
        { productId: "prod-001", grams: 30 }
      ]
    }
    ```

- `calculateMealNutrition(mealId, meals, products)` - Calculates nutrition for a meal
  - **Parameters**:
    - `mealId`: String (meal identifier)
    - `meals`: Object with meal data
    - `products`: Object mapping product IDs to product data
  - **Returns**: Object with total nutrition values for the meal
  - **Example**:
    ```javascript
    // Input:
    const mealId = "meal-001";
    const meals = {
      "meal-001": [
        { productId: "prod-001", grams: 30 }
      ]
    };
    const products = {
      "prod-001": {
        per100g: {
          energyKj: 2292,
          energyKcal: 549,
          fat: 33,
          saturatedFat: 13,
          carbohydrates: 55,
          sugars: 45,
          fiber: 2.4,
          protein: 6.8,
          sodium: 0.18
        }
      }
    };
    
    // Output:
    {
      energyKj: 687.6,
      energyKcal: 164.7,
      fat: 9.9,
      saturatedFat: 3.9,
      carbohydrates: 16.5,
      sugars: 13.5,
      fiber: 0.72,
      protein: 2.04,
      sodium: 0.054
    }
    ```

### src/tracking.js
**Purpose**: Manages daily nutrition tracking

**Exports**:
- `addDayNutrition(date, nutrition, tracking)` - Adds nutrition data for a day
  - **Parameters**:
    - `date`: String (YYYY-MM-DD format)
    - `nutrition`: Object with nutrition values
    - `tracking`: Object with tracking data
  - **Returns**: Updated tracking object
  - **Example**:
    ```javascript
    // Input:
    const date = "2024-01-15";
    const nutrition = {
      energyKj: 2000,
      energyKcal: 478,
      fat: 50,
      saturatedFat: 10,
      carbohydrates: 200,
      sugars: 60,
      fiber: 25,
      protein: 70,
      sodium: 1.5
    };
    const tracking = {};
    
    // Output:
    {
      "2024-01-15": {
        energyKj: 2000,
        energyKcal: 478,
        fat: 50,
        saturatedFat: 10,
        carbohydrates: 200,
        sugars: 60,
        fiber: 25,
        protein: 70,
        sodium: 1.5
      }
    }
    ```

- `getDayNutrition(date, tracking)` - Retrieves nutrition data for a day
  - **Parameters**:
    - `date`: String (YYYY-MM-DD format)
    - `tracking`: Object with tracking data
  - **Returns**: Object with nutrition values for the day (or null if no data)
  - **Example**:
    ```javascript
    // Output:
    {
      energyKj: 2000,
      energyKcal: 478,
      fat: 50,
      saturatedFat: 10,
      carbohydrates: 200,
      sugars: 60,
      fiber: 25,
      protein: 70,
      sodium: 1.5
    }
    ```

## Data Model

### Product
```javascript
{
  id: string,
  name: string,
  per100g: {
    energyKj: number,
    energyKcal: number,
    fat: number,
    saturatedFat: number,
    carbohydrates: number,
    sugars: number,
    fiber: number,
    protein: number,
    sodium: number
  }
}
```

### Meal
```javascript
{
  id: string,
  name: string,
  items: [
    {
      productId: string,
      grams: number
    }
  ]
}
```

### Daily Tracking
```javascript
{
  "YYYY-MM-DD": {
    energyKj: number,
    energyKcal: number,
    fat: number,
    saturatedFat: number,
    carbohydrates: number,
    sugars: number,
    fiber: number,
    protein: number,
    sodium: number
  }
}
```

## UI Requirements

### public/index.html
- Main application page with navigation
- Sections for:
  - Product scanning (camera/upload)
  - Product list
  - Meal planning
  - Daily tracking

### public/css/style.css
- Clean, minimal styling
- Mobile-responsive design
- Focus on readability and ease of use

### public/js/app.js
- Main application logic
- Handles UI interactions
- Integrates with src/ modules

### public/js/ocr.js (browser version)
- Browser-specific OCR handling
- Camera access and image capture
- Calls src/ocr.js with appropriate parameters

## Notes
- The OCR extraction uses an OpenAI-compatible endpoint configured by the user
- The tests never call the actual OCR endpoint; they mock the API calls
- All modules in src/ are pure functions where possible
- Browser-specific code (localStorage, camera, etc.) is in public/ or passed as parameters to src/ modules