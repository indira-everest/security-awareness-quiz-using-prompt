import path from "path";
import {
  ensureDir,
  readFileContent,
  writeFile,
  getPolicyFiles,
} from "./fileUtils.js";
import { generateQuestions } from "./generateQuestions.js";
import {
  getGeneralSecurityPrompt,
  getAdvancedTopicsPrompt,
  getNarrativeSpecificPrompt // <-- Import the new narrative prompt template
} from "./promptTemplates.js";

const inputDir = path.resolve("policies");
const outputDir = path.resolve("output");
const finalCsv = path.join(outputDir, "final_generated_questions.csv");

ensureDir(outputDir);

async function main(): Promise<void> {
  console.log("🚀 Starting quiz generation pipeline...");

  let combinedCsv = "";
  let headerAdded = false;

  // 1️⃣ General Security (Scenario-Focused)
  console.log("🌐 Generating General Security section...");
  const generalPrompt = getGeneralSecurityPrompt();
  const generalCsv = await generateQuestions(
    generalPrompt,
    path.join(outputDir, "general.csv")
  );
  combinedCsv += generalCsv + "\n";
  headerAdded = true;

  // 2️⃣ Advanced Topics (Scenario/Mistake-Focused)
  console.log("💻 Generating Advanced Topics section...");
  const advancedPrompt = getAdvancedTopicsPrompt();
  const advancedCsv = await generateQuestions(
    advancedPrompt,
    path.join(outputDir, "advanced.csv")
  );
  // Remove header from subsequent sections
  combinedCsv += advancedCsv.split("\n").slice(1).join("\n") + "\n";

  // 3️⃣ Policy PDFs (Now using the NARRATIVE/CHARACTER-DRIVEN template)
  const policyFiles = getPolicyFiles(inputDir);

  for (const file of policyFiles) {
    const policyPath = path.join(inputDir, file);
    const policyText = await readFileContent(policyPath);
    const policyName = file.replace(/\.(pdf|txt)$/i, "");

    console.log(
      `🏛️ Generating NARRATIVE Policy-Specific questions for: ${policyName}...`
    );
    // ⬇️ SWITCHED TO USING THE NARRATIVE TEMPLATE ⬇️
    const policyPrompt = getNarrativeSpecificPrompt(policyText, policyName);
    const policyCsv = await generateQuestions(
      policyPrompt,
      path.join(outputDir, `${policyName}_Narrative.csv`) // Changed filename for distinction
    );

    // Remove header from subsequent sections
    combinedCsv += policyCsv.split("\n").slice(1).join("\n") + "\n";
  }

  writeFile(finalCsv, combinedCsv);
  console.log(`🎉 All sections generated → ${finalCsv}`);
}

main().catch(console.error);