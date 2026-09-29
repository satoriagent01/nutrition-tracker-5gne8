/**
 * Extracts nutrition information from a nutrition label image using an OpenAI-compatible API.
 * @param {Object} imageData - The image data with type and content
 * @param {Object} config - Configuration with apiKey, model, and optionally url
 * @returns {Promise<Object>} Extracted nutrition values
 */
export async function extractNutrition(imageData, config) {
  const defaultNutrition = {
    calories: 0,
    fats: 0,
    saturatedFats: 0,
    sodium: 0,
    carbs: 0,
    sugars: 0,
    proteins: 0,
  };

  try {
    const url = config.url || "https://api.openai.com/v1/chat/completions";
    const prompt = `Extract nutrition information from this nutrition label image. Return a JSON object with the following keys (all values in grams per 100g, calories in kcal): calories, fats, saturatedFats, sodium, carbs, sugars, proteins. If a value cannot be determined, use 0.`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${imageData.type};base64,${imageData.content}` } },
            ],
          },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse JSON from the response
    let parsed;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsed = JSON.parse(jsonStr);
    } catch {
      // If parsing fails, return default values
      return defaultNutrition;
    }

    return {
      calories: Number(parsed.calories) || 0,
      fats: Number(parsed.fats) || 0,
      saturatedFats: Number(parsed.saturatedFats) || 0,
      sodium: Number(parsed.sodium) || 0,
      carbs: Number(parsed.carbs) || 0,
      sugars: Number(parsed.sugars) || 0,
      proteins: Number(parsed.proteins) || 0,
    };
  } catch {
    // Return default values on any error (network, parse, etc.)
    return defaultNutrition;
  }
}