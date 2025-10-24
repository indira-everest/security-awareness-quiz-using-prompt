// import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
// config.js (Updated for Gemini)
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set. Please obtain a key and set it.");
}
export const ai = new GoogleGenAI({});
export const MODEL_NAME = "gemini-2.5-pro";
// config.js (Updated for OpenAI)
// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
//# sourceMappingURL=config.js.map