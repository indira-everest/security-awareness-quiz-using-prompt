export const CSV_COLUMNS_AND_FORMAT = `
### 📊 Output Format (Strict CSV)
Return output **only** as CSV text (no Markdown, no explanations).

### 🎯 Objectives
- Mix easy, medium, and hard questions.
- Each question must be **self-contained**, **clear**, and **professionally written**.
- **Strict Compliance:** All questions must draw their content, correct answer, and explanation **EXCLUSIVELY** from the 'POLICY TEXT' above/context provided.
- **Direct Citation:** The "Policy Section / Reference" column and the "Explanation for Correct Answer" **MUST** contain a direct citation (e.g., "ISM.01 §4.1.4") from the Policy Text to back up the answer.


### 🧩 Question Diversity
Distribute questions across the following types:
- Mini-Story (MUST be Multiple Choice)
- Scenario-Based (MUST be Multiple Choice)
- Multiple Choice
- True/False (Can be presented as a choice between True/False options)
- “What If…” Scenario (MUST be Multiple Choice)
- Ethical Dilemma (MUST be Multiple Choice)
(You may reuse styles but ensure high narrative quality.)

**Column Headers (MUST be exact):**
"Question Theme","Prompt Used","Question ID","Policy Section / Reference","Generated Question Text","Correct Answer","Explanation for Correct Answer","Policy Alignment (Y/N)","Correctness of Answers (Y/N)","Clarity (1–5)","Engagement / Fun (1–5)","Accessibility / Readability (1–5)","Notes / Suggested Fixes"

---

### 🧠 Example Row (for structure reference)
"Scenario-Based","Generate a Scenario-Based question testing the mandatory use of MFA for remote access.","SC-099","Policy Manual","A sales rep attempts to log into the CRM from a hotel. After entering their password, the system asks for a code from their authenticator app. What company mandate is being enforced? Options: A) Clear Desk Policy B) Multi-Factor Authentication (MFA) ✅ C) Password Complexity Standard D) Data Classification Rule","B) Multi-Factor Authentication (MFA)","MFA is the policy-mandated control that requires a user to provide two or more verification factors to gain access to a resource, which significantly reduces the risk of credential theft.","Y","Y","5","4","5","Simple scenario testing a practical, common task."

---

### ⚙️ Output Requirements
- Ensure no duplicate questions.
- Keep all text quoted properly for valid CSV parsing.
- Each question must have its own detailed "Prompt Used" field.
`;

// Define organizational characters for reuse
const ORG_CHARACTERS = `
- **Craig (CEO)**: Executive decisions, high-stakes communication.
- **Ranga (CTO)**: Technical architecture, system design.
- **Jasmine (Security Lead)**: Policy enforcement, incident guidance.
- **Chris (AI Lead)**: Data handling for ML models, new technology risk.
- **Ashok, Rav, Sudhakar, Shruthi, Tom, Bruce (Project Managers)**: Project timelines, resource access, team adherence.
- **General roles to use**: Sales Rep, Developer, HR Specialist, Intern.
`;

// ----------------------------------------------------------------------
// TEMPLATE 1: Single Policy Question Generator (New Requirement)
// ----------------------------------------------------------------------
export function getSinglePolicyQuestionPrompt(
  policyText: string,
  policyName: string
): string {
  return `
You are a corporate compliance expert and a master storyteller for "Everest".
Your task is to generate **exactly 1 unique, high-quality quiz question** that tests a **MANDATORY RULE** from the policy provided below.

---
### 📜 POLICY CONTEXT
**Policy Name:** ${policyName}
**Policy Text:**
${policyText}
---

### 🎯 OBJECTIVES
- **Quantity:** Return **exactly 1 row**.
- **Question Format:** The question **MUST** be narrative (Mini-Story/Scenario) and the "Generated Question Text" **MUST** include Multiple Choice options (A, B, C, D, etc.).
- **Length:** The generated question text **MUST** be at least **100 words** long to ensure deep narrative context.
- **Naming:** The question text **MUST** explicitly mention the organization name **"Everest"** and the **Policy Name** provided above.
- **Character Use:** The scenario **MUST** include at least **one** of the following organizational characters: ${ORG_CHARACTERS}
- **Strict Compliance:** The content, answer, and explanation **EXCLUSIVELY** must come from the 'POLICY TEXT'.
- **Policy Alignment:** The "Policy Alignment (Y/N)" column **MUST** be set to **'Y'**.

${CSV_COLUMNS_AND_FORMAT}
`;
}

// ----------------------------------------------------------------------
// TEMPLATE 2: General Security Generator (4 Questions)
// ----------------------------------------------------------------------
export function getGeneralSecurityPrompt(): string {
  return `
You are a cybersecurity training expert for "Everest".
Your task is to generate **exactly 4 unique, high-quality quiz questions** focused **EXCLUSIVELY** on universal security awareness topics.

### 🎯 OBJECTIVES
- **Quantity:** Return **exactly 4 rows**.
- **Topic Focus:** Phishing, Social Engineering tactics, creating strong passwords, and general safe browsing habits.
- **Engagement:** **All 4 questions (100%) MUST be Narrative/Scenario-Based, and the "Generated Question Text" MUST include Multiple Choice options (A, B, C, D, etc.).**
- **Length:** **At least 2 out of the 4 questions (50%) MUST have a question text of at least 100 words.**
- **Character Use:** At least **2 out of the 4 questions** **MUST** include at least one of the following organizational characters: ${ORG_CHARACTERS}
- **Naming:** The question text **MUST** explicitly mention the organization name **"Everest"**.
- **Policy Alignment:** The "Policy Alignment (Y/N)" column **MUST** be set to **'N'**.
- **Context:** Do NOT reference any internal policy documents, numbers, or specific company rules.

${CSV_COLUMNS_AND_FORMAT}
`;
}

// ----------------------------------------------------------------------
// TEMPLATE 3: Advanced Topics Generator (3 Questions)
// ----------------------------------------------------------------------
export function getAdvancedTopicsPrompt(): string {
  return `
You are an expert security professional for "Everest".
Your task is to generate **exactly 3 unique, high-quality quiz questions** for technical employees, focused on **Advanced Security and Development Topics**.

### 🎯 OBJECTIVES
- **Quantity:** Return **exactly 3 rows**.
- **Topic Focus:** Concepts like OWASP Top 10 (Injection, Broken Access Control), Secure Coding, Secrets Management, and Cryptography Basics.
- **Engagement:** **All 3 questions (100%) MUST be Narrative/Scenario-Based or "Spot the Mistake" format, and the "Generated Question Text" MUST include Multiple Choice options (A, B, C, D, etc.).**
- **Length:** At least **1 out of the 3 questions (33%) MUST have a question text of at least 100 words.**
- **Character Use:** At least **1 out of the 3 questions** **MUST** include at least one of the following organizational characters: ${ORG_CHARACTERS}
- **Naming:** The question text **MUST** explicitly mention the organization name **"Everest"**.
- **Policy Alignment:** The "Policy Alignment (Y/N)" column **MUST** be set to **'N'**.

${CSV_COLUMNS_AND_FORMAT}
`;
}

// ----------------------------------------------------------------------
// TEMPLATE 4: (DEPRECATED/REPLACED by getSinglePolicyQuestionPrompt)
// ----------------------------------------------------------------------
export function getNarrativeSpecificPrompt(
  policyText: string,
  policyName: string
): string {
  return getSinglePolicyQuestionPrompt(policyText, policyName);
}