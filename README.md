# 🛡️ Security Training Uplift: Quiz Generator

---

## 🎯 Project Overview

This project uses the **Google Gemini API** to automatically generate high-quality, compliance-driven security awareness quiz questions. It processes internal policy documents (PDFs/TXTs) and generates content for policy-specific, general, and advanced security topics.

The output is structured for immediate use: a single, merged **CSV** for evaluation and reporting, and a **GIFT** file (as a `.txt` extension for Moodle) for direct import into your Learning Management System (LMS).

---

## ✨ Key Features

* **Policy-Driven:** Generates questions with direct citations and explanations from internal policies.
* **Structured Output:** Consistent CSV schema across all question types for easy merging and analysis.
* **LMS Ready:** Final output is converted to the **Moodle GIFT format** (exported as a `.txt` file).
* **Clean Organization:** Output is separated into dedicated `csv/` and `gift/` directories.

---

## 🛠 Technology Stack

| Component | Detail |
| :--- | :--- |
| **Project Name** | `security-training-uplift` |
| **Runtime** | Node.js (v18+) |
| **Language** | TypeScript |
| **AI Model** | Google Gemini API (`gemini-2.5-pro`) |
| **Key Utilities** | `pdf2json`, `papaparse` |

---

## 🚀 Getting Started

### 1. Prerequisites

* Node.js (v18+)
* A **Gemini API Key** from Google AI Studio.

### 2. Setup

```bash
# Clone the repository
git clone [YOUR_REPO_URL]
cd security-training-uplift
npm install
```

### 3. Configuration
1. **API Key:** Create a ```.env``` file in the root directory.

2. **Edit** ```.env```: Add your actual API key.

```# .env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### 4. Input & Run
1, **Input Policies**: Place your security policy documents (```.pdf``` or ```.txt```) into the ```policies/``` directory.

2, ***Execute the Pipeline***:
```
npm run generate
```

## 📂 Output Structure
The generation script creates the following organized folder structure inside ```output/```:

**Directory Structure**

| Component | Detail |
| :--- | :--- |
| **Final Merged CSV(Evals/Review)** |	output/csv/security_awareness_questions.csv |
| **General Questions(e.g., Phishing)** | output/csv/security_awareness_general_questions.csv |
| **Advanced Questions(e.g., OWASP)** |	output/csv/security_awareness_advanced_questions.csv |
| **Policy Questions(Individual policy questions)** | output/csv/[POLICY_NAME]_policy_questions.csv |
| **Final Moodle GIFT Import File(GIFT format)** | output/gift/security_awareness_questions.txt |

**File Usage**

| File Path | Purpose | Format |
| :--- | :--- | :--- |
| **output/csv/*.csv** | Used by the Security/Training team for evaluation, review, and reporting. | ```CSV```
| **output/gift/*.txt** | Uploaded directly to Moodle or a compatible LMS for course deployment. | ```GIFT (as .txt)```