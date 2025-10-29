import path from "path";
import {
  ensureDir,
  readFileContent,
  writeFile,
  getPolicyFiles,
  writeGiftFile,
} from "./fileUtils.js";
import { generateQuestions } from "./generateQuestions.js";
import {
  getGeneralSecurityPrompt,
  getAdvancedTopicsPrompt,
  getNarrativeSpecificPrompt,
} from "./promptTemplates.js";
import { withRetry } from "./retryUtils.js";

const inputDir = path.resolve("policies");
const outputDir = path.resolve("output");
const finalCsvPath = path.join(outputDir, "final_generated_questions.csv");

ensureDir(outputDir);

/**
 * Generate quiz questions for a single section (e.g., general, advanced)
 */
async function generateSection(
  label: string,
  promptFn: () => string,
  outputFile: string,
  skipHeader = false
) {
  const csv = await withRetry(generateQuestions, [
    promptFn(),
    path.join(outputDir, outputFile),
  ]);

  console.log(`${label} section done → ${outputFile}`);
  return skipHeader ? csv.split("\n").slice(1).join("\n") : csv;
}

/**
 * Generate quiz questions for each policy file (PDF or TXT)
 */
async function generatePolicySections() {
  const policyFiles = getPolicyFiles(inputDir);
  let combined = "";

  for (const file of policyFiles) {
    const policyPath = path.join(inputDir, file);
    const policyName = file.replace(/\.(pdf|txt)$/i, "");

    console.log(`Processing policy: ${policyName}`);
    const policyText = await readFileContent(policyPath);
    const policyPrompt = getNarrativeSpecificPrompt(policyText, policyName);
    const csv = await withRetry(generateQuestions, [
      policyPrompt,
      path.join(outputDir, `${policyName}_Narrative.csv`),
    ]);

    // skip header lines to avoid duplicates
    combined += csv.split("\n").slice(1).join("\n") + "\n";
  }

  return combined;
}

/**
 * Main generation pipeline
 */
async function main() {
  console.log("🚀 Starting quiz generation pipeline...\n");

  const generalCsv = await generateSection(
    "General Security",
    getGeneralSecurityPrompt,
    "general.csv"
  );

  const advancedCsv = await generateSection(
    "Advanced Topics",
    getAdvancedTopicsPrompt,
    "advanced.csv",
    true
  );

  const policyCsv = await generatePolicySections();

  const finalCsv = [generalCsv, advancedCsv, policyCsv].join("\n");
  writeFile(finalCsvPath, finalCsv);
  writeGiftFile(finalCsvPath, outputDir);

  console.log(`\n All sections generated successfully → ${finalCsvPath}\n`);
}

main().catch((err) => {
  console.error("Quiz generation failed:", err);
});
