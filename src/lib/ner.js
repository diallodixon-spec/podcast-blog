import Together from "together-ai";

//console.log("RAW OUTPUT:", output);

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

// -----------------------------
// chunking
// -----------------------------
function chunkText(text, chunkSize = 500, overlap = 100) {
  const words = text.split(" ");
  const chunks = [];

  let i = 0;

  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    chunks.push(chunk);
    i += chunkSize - overlap;
  }

  return chunks;
}

// -----------------------------
// prompt
// -----------------------------
function buildPrompt(chunk) {
  return `
Extract named entities from this article. Ensure to go line by line to identify all named entities. Prioritize accuracy over speed.

Return ONLY valid JSON:

{
  "entities": [
    {
      "found": "original name",
      "suggested": "correct canonical name"
    }
  ]
}

Rules:
- ONLY return JSON
- No explanations
- No markdown
- No bullet points
- Be exhaustive

ARTICLE SECTION:
${chunk}
`;
}

// -----------------------------
// normalize + dedupe
// -----------------------------
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function deduplicateEntities(entities) {
  const map = new Map();

  for (const e of entities) {
    const key = normalize(e.suggested || e.found);
    if (!map.has(key)) {
      map.set(key, e);
    }
  }

  return Array.from(map.values());
}

// -----------------------------
// MAIN EXPORT
// -----------------------------
export async function extractEntities(text) {
  const chunks = chunkText(text);
  let allEntities = [];

  for (const chunk of chunks) {
    try {
      const resp = await together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3-8B-Instruct-Lite",
        max_tokens: 1500,
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: buildPrompt(chunk),
          },
        ],
      });

      const output = resp?.choices?.[0]?.message?.content || "";
      console.log("RAW OUTPUT:");
      console.log(output);
      const jsonMatch = output.match(/\{[\s\S]*\}/);

      if (!jsonMatch) continue;

      const parsed = JSON.parse(jsonMatch[0]);

      if (parsed?.entities?.length) {
        allEntities.push(...parsed.entities);
      }
    } catch (err) {
      console.log("NER chunk failed:", err.message);
    }
  }

  return deduplicateEntities(allEntities);
}