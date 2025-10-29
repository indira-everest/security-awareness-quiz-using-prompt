/**
 * Calls Gemini and returns the generated CSV text.
 */

import fs from "fs";
import { ai, MODEL_NAME } from "../config.js";

export async function generateQuestions(
  prompt: string,
  outputPath: string
): Promise<string> {
  console.log(`Generating questions for: ${outputPath} using ${MODEL_NAME}`);

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
    return content;
  } catch (error) {
    console.error(`Error generating questions for ${outputPath}:`, error);
    throw error;
  }
}