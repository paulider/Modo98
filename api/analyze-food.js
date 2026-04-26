import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function extractJson(text) {
  const clean = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No valid JSON returned");
  }

  return JSON.parse(clean.slice(start, end + 1));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing image" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Analiza esta comida para una app llamada PauFit.

Devuelve SOLO JSON válido con esta estructura:
{
  "rating": "Bien | Regular | Me he pasado",
  "calories_estimate": number,
  "protein_estimate": number,
  "carbs_estimate": number,
  "fat_estimate": number,
  "foods_detected": ["..."],
  "positive_points": ["..."],
  "improve_points": ["..."],
  "paufit_verdict": "..."
}

Reglas:
- Las calorías son estimación visual, no medición exacta.
- Sé prudente: usa rangos medios razonables, pero devuelve un número.
- Prioriza pérdida de grasa sostenible.
- Valora positivamente proteína y verdura.
- Penaliza alcohol, fritos, ultraprocesados, salsas pesadas y raciones muy grandes.
- Usuario: varón, 42 años, 186 cm, 105 kg, objetivo perder grasa.
- No le gustan brócoli, acelgas, coliflor, col ni espinacas.
`
            },
            {
              type: "input_image",
              image_url: image,
              detail: "low"
            }
          ]
        }
      ]
    });

    const parsed = extractJson(response.output_text);

    return res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Food analysis failed",
      details: error.message
    });
  }
}
