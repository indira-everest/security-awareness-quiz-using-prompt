export const CSV_COLUMNS_AND_FORMAT = `
### 📊 Output Format (Strict CSV)
Return output **only** as CSV text (no Markdown, no explanations).

### 🎯 Objectives
- Mix easy, medium, and hard questions.
- Each question must be **self-contained**, **clear**, and **professionally written**.
- **Strict Compliance:** All 5 questions must draw their content, correct answer, and explanation **EXCLUSIVELY** from the 'POLICY TEXT' above.
- **Direct Citation:** The "Policy Section / Reference" column and the "Explanation for Correct Answer" **MUST** contain a direct citation (e.g., "ISM.01 §4.1.4") from the Policy Text to back up the answer.


### 🧩 Question Diversity
Distribute questions across the following types:
- Spot the Mistake
- Mini-Story
- Scenario-Based
- Multiple Choice
- True/False
- Feedback-Driven
- Ordering/Sequencing
- Odd One Out
- Fill-in-the-Blank
- Hotspot/Image-Based (describe the image context)
- “What If…” Scenario
- Logic Puzzle
- Comparison/Swipe
- Ethical Dilemma
- Data Path/Flow Question
(You may reuse styles but ensure diversity across 30 questions.)

**Column Headers (MUST be exact):**
"Question Theme","Prompt Used","Question ID","Policy Section / Reference","Generated Question Text","Correct Answer","Explanation for Correct Answer","Policy Alignment (Y/N)","Correctness of Answers (Y/N)","Clarity (1–5)","Engagement / Fun (1–5)","Accessibility / Readability (1–5)","Notes / Suggested Fixes"

---

### 🧠 Example Row (for structure reference)
"Scenario-Based","Generate a Scenario-Based question testing the mandatory use of MFA for remote access.","SC-099","Policy Manual","A sales rep attempts to log into the CRM from a hotel. After entering their password, the system asks for a code from their authenticator app. What company mandate is being enforced? Options: A) Clear Desk Policy B) Multi-Factor Authentication (MFA) ✅ C) Password Complexity Standard D) Data Classification Rule","B) Multi-Factor Authentication (MFA)","MFA is the policy-mandated control that requires a user to provide two or more verification factors to gain access to a resource, which significantly reduces the risk of credential theft.","Y","Y","5","4","5","Simple scenario testing a practical, common task."

---

### ⚙️ Output Requirements
- Return **exactly 5 rows**.
- Ensure no duplicate questions.
- Keep all text quoted properly for valid CSV parsing.
- Each question must have its own detailed "Prompt Used" field.
`;

// ----------------------------------------------------------------------
// TEMPLATE 1: Policy-Specific Generator
// ----------------------------------------------------------------------
export function getPolicySpecificPrompt(
  policyText: string,
  policyName: string
): string {
  return `
You are an expert in corporate compliance training.
Your task is to generate **exactly 5 unique, high-quality quiz questions** that test **MANDATORY RULES** from the policy provided below.

---
### 📜 POLICY CONTEXT
**Policy Name:** ${policyName}
**Policy Text:**
${policyText}
---

### 🎯 OBJECTIVES
- **Strict Compliance:** All 5 questions must draw their content, correct answer, and explanation **EXCLUSIVELY** from the 'POLICY TEXT' above.
- **Policy Alignment:** The "Policy Alignment (Y/N)" column **MUST** be set to **'Y'** for all 5 questions.
- **Focus:** Mix question types across Scenario, True/False, and Multiple Choice.
- **Avoid:** Do not introduce external concepts (like OWASP Top 10 or general phishing) that are not mentioned in the policy text.

${CSV_COLUMNS_AND_FORMAT}
`;
}

// ----------------------------------------------------------------------
// TEMPLATE 2: General Security Generator
// ----------------------------------------------------------------------
export function getGeneralSecurityPrompt(): string {
  return `
You are a cybersecurity training expert.
Your task is to generate **exactly 5 unique, high-quality quiz questions** focused **EXCLUSIVELY** on universal security awareness topics.

### 🎯 OBJECTIVES
- **Topic Focus:** Phishing, Social Engineering tactics, creating strong passwords, and general safe browsing habits.
- **Policy Alignment:** The "Policy Alignment (Y/N)" column **MUST** be set to **'N'** for all 5 questions.
- **Context:** Do NOT reference any internal policy documents, numbers, or specific company rules.

${CSV_COLUMNS_AND_FORMAT}
`;
}

// ----------------------------------------------------------------------
// TEMPLATE 3: Advanced Topics Generator
// ----------------------------------------------------------------------
export function getAdvancedTopicsPrompt(): string {
  return `
You are an expert security professional.
Your task is to generate **exactly 5 unique, high-quality quiz questions** for technical employees, focused on **Advanced Security and Development Topics**.

### 🎯 OBJECTIVES
- **Topic Focus:** Concepts like OWASP Top 10 (Injection, Broken Access Control), Secure Coding, Secrets Management, and Cryptography Basics.
- **Policy Alignment:** The "Policy Alignment (Y/N)" column **MUST** be set to **'N'** for all 5 questions.
- **Content:** Include one 'Spot the Mistake' question that contains a small, relevant code snippet or configuration error.

${CSV_COLUMNS_AND_FORMAT}
`;
}
