## Repo-focused instructions for AI coding agents

Purpose: Help an AI contributor become productive quickly in this codebase. Focus is on the quiz-generation pipeline that reads policy PDFs/TXTs and produces strict CSV outputs via an LLM (Gemini/OpenAI).

Quick start (developer-visible commands)
- Install dependencies: `npm install`
- Generate content (preferred in dev): `npm run generate` (runs `npx tsx src/generateAll.ts`)
- Clean outputs: `npm run clean`
- Build TypeScript: `npm run build` (produces JS if needed for `npm start`)

High level architecture (what to read first)
- `src/generateAll.ts` — orchestration script. Reads `policies/`, calls prompts, merges CSVs into `output/final_generated_questions.csv`.
- `src/promptTemplates.ts` — contains all prompt templates used to ask the LLM. Important functions: `getSinglePolicyQuestionPrompt` (policy-specific narrative), `getGeneralSecurityPrompt`, `getAdvancedTopicsPrompt`.
- `src/generateQuestions.ts` — LLM wrapper. Calls `ai.models.generateContent(...)` (Gemini) and writes partial CSV outputs to `output/`.
- `src/config.ts` — AI client configuration. Key values: `MODEL_NAME` (default `gemini-2.5-pro`), and requirement: `GEMINI_API_KEY` in `.env`.
- `src/fileUtils.ts` — PDF/text parsing utilities (uses `pdf2json`). Use `readFileContent()` to load policy text.

Important integration points & conventions
- Environment: The pipeline expects `GEMINI_API_KEY` in a `.env` (see `README.md` and `src/config.ts`). If you need to switch to OpenAI, config contains commented code samples.
- CSV output is strict: the generator expects the LLM to return CSV text only (no Markdown or commentary). The canonical schema is defined in `src/promptTemplates.ts` under the `CSV_COLUMNS_AND_FORMAT` constant — the column headers must be exact.
- Filenames: policy outputs are written as `output/<POLICY_NAME>_Narrative.csv`. There are also `output/general.csv`, `output/advanced.csv`, and a merged `output/final_generated_questions.csv`.
- Prompt constraints are authoritative: e.g., `getSinglePolicyQuestionPrompt` requests exactly 1 row, 100+ words, and that the generated question explicitly mention the organization name `"Everest"` and include an organizational character. Agents editing prompts should preserve these constraints unless intentionally changing behavior.

Agent behavior rules (must follow when writing or modifying code that generates prompts or processes LLM output)
- Never alter the CSV schema in the code without updating `CSV_COLUMNS_AND_FORMAT` and `src/generateAll.ts` merging logic.
- Ensure the LLM is instructed to return CSV only. The code already sets `systemInstruction` in `generateQuestions.ts` — keep that or improve it but keep the intent.
- Policy-specific questions MUST include a direct policy citation in the "Policy Section / Reference" and the explanation must be drawn exclusively from the `POLICY TEXT` (see `CSV_COLUMNS_AND_FORMAT` enforcement language).
- When changing the AI model or parameters, update `src/config.ts` (`MODEL_NAME`) and, if needed, the system instruction in `generateQuestions.ts` so output consistency is retained.

Examples and pointers to follow in PRs
- To change how PDFs are read or to add support for DOCX, update `src/fileUtils.ts` and ensure `getPolicyFiles()` still returns only supported extensions.
- To alter the number of generated questions for a template, update the corresponding function in `src/promptTemplates.ts` (e.g., `getGeneralSecurityPrompt()`), and verify the merge logic in `src/generateAll.ts` still strips duplicate headers.
- If debugging an empty LLM response: check `src/generateQuestions.ts` for thrown error `Gemini API returned empty content.` Also check API key, model name, and increased logging around `response.text`.

Debugging & developer workflows
- Run locally with `npm run generate` (uses `tsx` to run TS directly). If using `npm start`, run `npm run build` first because `start` executes the compiled JS entry `src/generateAll.js`.
- There are no unit tests in the repo. For quick validation, run the pipeline against a single small policy file and inspect `output/<policy>_Narrative.csv` before merging.
- To quickly re-run a single template: comment out other stages in `src/generateAll.ts` or call `generateQuestions()` directly from a small script.

Files to reference when making changes
- `src/generateAll.ts` — pipeline ordering and how CSVs are merged
- `src/promptTemplates.ts` — all canonical prompt text (contains `CSV_COLUMNS_AND_FORMAT` and examples)
- `src/generateQuestions.ts` — how LLM calls are made and where to change system instructions/config
- `src/config.ts` — where the AI client and model are configured
- `src/fileUtils.ts` — PDF parsing and file IO helpers

Edge cases & gotchas discovered in the codebase
- `pdf2json` decoding: `readFileContent()` decodes page text via `decodeURIComponent(...)`. If PDFs have unusual encodings, parse failures may occur and will throw. Add robust fallback if needed.
- Header stripping: `generateAll.ts` concatenates CSVs by manually removing headers from subsequent sections (`.split("\n").slice(1)`). If the LLM ever returns an extra blank line, the merged CSV may contain malformed rows — be conservative when changing this logic.

If you update this file
- Preserve the short actionable format. Keep examples that reference `CSV_COLUMNS_AND_FORMAT` and `getSinglePolicyQuestionPrompt`.

Need more detail? Tell me which part of the pipeline you want deeper examples for (prompt engineering, parsing PDFs, or safe merging of CSVs) and I will expand this document.
