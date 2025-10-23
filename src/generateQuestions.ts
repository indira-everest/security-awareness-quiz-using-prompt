/**
 * Calls Gemini and returns the generated CSV text.
 */

import fs from "fs";
import { ai, MODEL_NAME } from "./config.js";

export async function generateQuestions(
  prompt: string,
  outputPath: string
): Promise<string> {
  console.log(`🤖 Generating questions for: ${outputPath} using ${MODEL_NAME}`);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction:
          "You are an expert CSV generator. You MUST return ONLY the requested CSV content and nothing else. Ensure the column headers are the first row and are quoted correctly.",
      },
    });

    const content = response?.text?.trim();

    if (!content) {
      throw new Error("Gemini API returned empty content.");
    }

    fs.writeFileSync(outputPath, content, "utf8");
    console.log(`✅ Saved partial output: ${outputPath}`);

    return content;
  } catch (error) {
    console.error(`❌ Error generating questions for ${outputPath}:`, error);
    throw error;
  }
}

/**
 * Calls OpenAI and returns the generated CSV text.
 */

// import { openai } from "./config.js";
// import fs from "fs";

// export async function generateQuestions(prompt: string, outputPath: string): Promise<string> {
//   console.log(`🤖 Generating questions for: ${outputPath}`);

//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.7,
//   });

//   const content = response.choices?.[0]?.message?.content?.trim() || "";
//   fs.writeFileSync(outputPath, content, "utf8");
//   console.log(`✅ Saved partial output: ${outputPath}`);

//   return content;
// }