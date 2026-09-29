/**
 * OCR extraction from nutrition label images using OpenAI-compatible API.
 *
 * @param {object} imageData - Object with { type: "image", content: "base64..." }
 * @param {object} config - Object with { apiKey, model }
 * @returns {Promise<object>} Nutrition values extracted from the image
 */
export async function extractNutrition(imageData, config) {
  const { apiKey, model } = config;

  // Build the API request body for an OpenAI-compatible vision endpoint
  const body = {
    model: model || "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imageData.content.startsWith("data:") ? imageData.content : `data:image/png;base64,${imageData.content}`,
            },
          },
          {
            type: "text",
            text: "Extract the nutrition information from this label. Return a JSON object with keys: calories (number, kcal per 100g), fats (number, g per 100g), saturatedFats (number, g per 100g), sodium (number, mg per 100g), carbs (number, g per 100g), sugars (number, g per 100g), proteins (number, g per 100g). Only return valid JSON.",
          },
        ],
      },
    ],
    max_tokens: 500,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`OCR API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";

  // Try to parse the JSON from the response
  try {
    // Find JSON object in the response text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        calories: Number(parsed.calories) || 0,
        fats: Number(parsed.fats) || 0,
        saturatedFats: Number(parsed.saturatedFats) || 0,
        sodium: Number(parsed.sodium) || 0,
        carbs: Number(parsed.carbs) || 0,
        sugars: Number(parsed.sugars) || 0,
        proteins: Number(parsed.proteins) || 0,
      };
    }
  } catch {
    // If parsing fails, return zeros
  }

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