import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY environment variable not set. Please obtain a key and set it."
  );
}
export const ai = new GoogleGenAI({});
export const MODEL_NAME = "gemini-2.5-pro";
