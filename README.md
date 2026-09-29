# Nutrition Tracker

A free, ad-free web application for tracking nutrition from food products.

## Features

- **Scan Nutrition Labels**: Take or upload photos of nutrition labels. Uses AI (OpenAI-compatible) to extract nutrition information automatically.
- **Product Database**: Store scanned products with their nutrition data (per 100g).
- **Meal Planning**: Create custom meals by adding products with specific gram amounts.
- **Daily Tracking**: Track your daily intake of calories, fats, saturated fats, sodium, carbs, sugars, and proteins.
- **Multi-language Support**: The AI can extract nutrition data from labels in various languages (German, Dutch, French, Italian, English, etc.).

## Setup

### Prerequisites

- Node.js 24+
- A modern web browser
- An OpenAI-compatible API endpoint (e.g., OpenAI, Ollama, LM Studio)

### Running the App

This is a static web application. You can serve it with any HTTP server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx)
npx serve public

# Using Node.js http-server
npx http-server public -p 8080
```

Then open `http://localhost:8080` in your browser.

### Configuring the AI Endpoint

1. Open the app in your browser
2. In the "AI Configuration" section at the top:
   - **API URL**: Your OpenAI-compatible endpoint (e.g., `https://api.openai.com/v1` or `http://localhost:11434/v1`)
   - **API Key**: Your API key (for OpenAI: `sk-...`, for Ollama: can be left empty)
   - **Model**: The model to use (e.g., `gpt-4-vision-preview`, `gpt-4o`, `llava`)
3. Click "Save Config"

## Testing

```bash
npm test
```

The tests verify:
- OCR extraction of nutrition data from images
- Product saving and retrieval
- Meal planning with custom gram amounts
- Daily nutrition tracking and aggregation

## Data Model

- **Products**: Each product has an ID, name, and nutrition values per 100g (calories, fats, saturated fats, sodium, carbs, sugars, proteins).
- **Meals**: A meal contains a list of items, each referencing a product and a gram amount.
- **Tracking**: Daily totals keyed by date (YYYY-MM-DD), aggregating all meals added for that day.

## Not Yet Done

- No server-side backend (data is stored in localStorage)
- No user authentication
- No cloud sync between devices
- No barcode scanning
- No nutritional goal setting
- No export/import of data
- No dark mode or theme customization