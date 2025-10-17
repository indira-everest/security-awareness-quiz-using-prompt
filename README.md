# 🛡️ Security Awareness Quiz Generator
This project automates the generation of high-quality, compliance-driven security awareness quiz questions using the Gemini API. It processes internal policy documents (PDFs/TXTs) and generates content for general and advanced security topics, outputting a single, structured CSV ready for any Learning Management System (LMS).

# ✨ Key Features
## Policy-Driven Accuracy:
Extracts mandatory rules directly from policy files in the policies/ folder.

## Structured Output: 
Generates a strict CSV format with audited columns (e.g., Policy Section / Reference) using the Gemini API's system instructions.

## Modular Pipeline: 
Separates logic into General, Advanced, and Policy-Specific generation phases.

## Robust & Scalable: 
Uses gemini-2.5-pro and includes retry logic for stable, high-volume question generation.

# 🚀 Getting Started

## 1. Prerequisites
Node.js (v18+)

## 2. Setup
git clone [YOUR_REPO_URL]

cd [REPO_NAME]

npm install

## 3. Configuration
Create a .env file in the root directory and add your API key:

### Code snippet
#### .env file
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

## 4. Run
Place your policy files in the policies/ directory, then run the pipeline:
npm run generate

## 📂 Output
The final merged quiz is saved as output/final_generated_questions.csv.
