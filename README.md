# 🛡️ Security Awareness Quiz Generator
This project automates the generation of high-quality, compliance-driven security awareness quiz questions using the Gemini API. It processes internal policy documents (PDFs/TXTs) and generates content for general and advanced security topics, outputting a single, structured CSV ready for any Learning Management System (LMS).

# 🛠 Quiz Generation Setup (Node.js + TypeScript)

I created a Node.js + TypeScript setup to generate structured quiz questions. The process works as follows:

## Input

/policies folder contains PDF or text versions of internal policies.

These serve as the source for Policy-Specific questions.

PDFs are parsed using pdf2json to extract text content for the prompts.

## Prompt Templates

There are three types of prompts, all using a common CSV template:

### Template	Focus	Policy Alignment
🧱 Policy-Specific	Questions directly from internal policies	✅ Y
🌐 General Security	Awareness topics like phishing, passwords, safe browsing	❌ N
⚙️ Advanced Topics	Technical security: secure coding, OWASP, cryptography	❌ N

Important: Even though the prompts differ, they all use the same CSV format, ensuring consistent output.

## Generation

Each prompt produces exactly 5 high-quality questions per run.

Questions are clear, self-contained, and professional.

Policy-Specific questions include direct references and explanations from the policy text.

Question types are diverse: Scenario, Multiple Choice, True/False, Spot the Mistake, Mini-Story, Ordering, Ethical Dilemma, Hotspot/Image-Based, etc.

## Output

Separate CSV files are generated for each template:

Policy-Specific → output/[POLICY_NAME].csv

General Security → output/general.csv

Advanced Topics → output/advanced.csv

All files can be merged into a final CSV: output/final_generated_questions.csv for easy review.

## Consistency & Scalability

All templates follow the same CSV schema, ensuring uniformity.

The setup allows the team to automate quiz generation, maintain structured outputs, and scale easily across multiple policies or topics.

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
