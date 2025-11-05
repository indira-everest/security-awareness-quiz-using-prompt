import path from "path";
import {
  ensureDir,
  readFileContent,
  writeFile,
  getPolicyFiles,
} from "./utils/fileUtils.js";
import { generateQuestions } from "./utils/generateQuestions.js";
import {
  getGeneralSecurityPrompt,
  getAdvancedTopicsPrompt,
  getSinglePolicyQuestionPrompt,
} from "./promptTemplates.js";
import { withRetry } from "./utils/retryUtils.js";
import { writeGiftFile } from "./utils/convertCsvToGiftUtils.js";

const inputDir = path.resolve("policies");
const outputDir = path.resolve("output");

const csvOutputDir = path.join(outputDir, "csv");
const giftOutputDir = path.join(outputDir, "gift");

const finalCsvPath = path.join(
  csvOutputDir,
  "security_awareness_questions.csv"
);
const finalGiftPath = path.join(
  giftOutputDir,
  "security_awareness_questions.txt"
);

ensureDir(outputDir);
ensureDir(csvOutputDir);
ensureDir(giftOutputDir);

/**
 * Generate quiz questions for a single section (e.g., general, advanced)
 */
async function generateSection(
  label: string,
  promptFn: () => string,
  outputFileName: string,
  skipHeader = false
) {
  const csv = await withRetry(generateQuestions, [
    promptFn(),
    path.join(csvOutputDir, outputFileName),
  ]);
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

    const policyText = await readFileContent(policyPath);
    const policyPrompt = getSinglePolicyQuestionPrompt(policyText, policyName);
    const csv = await withRetry(generateQuestions, [
      policyPrompt,
      path.join(csvOutputDir, `${policyName}_policy_questions.csv`),
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
    "security_awareness_general_questions.csv"
  );

  const advancedCsv = await generateSection(
    "Advanced Topics",
    getAdvancedTopicsPrompt,
    "security_awareness_advanced_questions.csv",
    true
  );

  const policyCsv = await generatePolicySections();

  const finalCsv = [generalCsv, advancedCsv, policyCsv].join("\n");
  writeFile(finalCsvPath, finalCsv);
  writeGiftFile(finalCsvPath, finalGiftPath);

  console.log(`\n✅ Pipeline complete: 
    CSV Master file: ${finalCsvPath}
    Moodle GIFT file: ${finalGiftPath}\n`);
}

main().catch((err) => {
  console.error("Quiz generation failed:", err);
});
