import fs from "fs";
import path from "path";
import Papa from "papaparse";

/**
 * Converts final CSV content → properly formatted GIFT text for Moodle import.
 * Includes per-option feedback and post-submission explanation.
 */
export function convertCsvToGift(csvContent: string): string {
  const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
  const rows = parsed.data as Record<string, string>[];

  let giftText = "";

  for (const row of rows) {
    const id = (row["Question ID"] || "").trim();
    const section = (row["Policy Section / Reference"] || "").trim();
    const alignment = (row["Policy Alignment"] || "Y").trim();
    const correctness = (row["Correctness of Answer"] || "Y").trim();
    const clarity = (row["Clarity"] || "5/5").trim();
    const engagement = (row["Engagement/Fun"] || "5/5").trim();
    const access = (row["Accessibility/Readability"] || "5/5").trim();
    const question = (row["Generated Question Text"] || "").trim();
    const explanation = (row["Explanation for Correct Answer"] || "").trim();
    const correctAnswer = (row["Correct Answer"] || "").trim();

    // Extract options (A), B), C), D))
    const optionRegex = /([A-D]\))\s*(.*?)(?=\s*[A-D]\)|$)/gs;
    const options: string[] = [];
    let match;
    while ((match = optionRegex.exec(question))) {
      const label = match[1].trim(); // e.g., "A)"
      const text = match[2].trim(); // e.g., "Log in for the Intern..."
      options.push(`${label} ${text}`);
    }

    // Remove options from main question body
    const questionText = question.replace(optionRegex, "").trim();

    // ===== GIFT Metadata Comments =====
    giftText += `// =====================================================\n`;
    giftText += `// Policy Section/Reference: ${section}\n`;
    giftText += `// Policy Alignment: ${alignment}\n`;
    giftText += `// Correctness of Answer: ${correctness}\n`;
    giftText += `// Clarity: ${clarity}\n`;
    giftText += `// Engagement/Fun: ${engagement}\n`;
    giftText += `// Accessibility/Readability: ${access}\n`;
    giftText += `// =====================================================\n\n`;

    // ===== Build GIFT Question =====
    giftText += `::${id || "Question"}::\n`;
    giftText += `${questionText} {\n`;

    for (const opt of options) {
      // Check if this option matches the correct answer text (case-insensitive)
      const isCorrect = opt.toLowerCase().includes(correctAnswer.toLowerCase());

      // Remove A)/B)/C)/D) from displayed text (Moodle auto adds a., b., etc.)
      const cleanOptionText = opt.replace(/^[A-D]\)\s*/, "");

      const prefix = isCorrect ? "=" : "~";
      const feedback = isCorrect ? " #✅ Correct!" : " #❌ Incorrect.";

      giftText += `    ${prefix}${cleanOptionText}${feedback}\n`;
    }

    // Add overall feedback after question
    if (explanation) {
      giftText += `#### ${explanation}\n`;
    }

    giftText += `}\n\n`;
  }

  return giftText.trim();
}

/**
 * Reads a final CSV and writes a `.gift` file alongside it.
 */
export function writeGiftFile(finalCsvPath: string, outputDir: string): void {
  const csvContent = fs.readFileSync(finalCsvPath, "utf8");
  const giftContent = convertCsvToGift(csvContent);
  const giftPath = path.join(outputDir, "final_generated_questions.txt");
  fs.writeFileSync(giftPath, giftContent, "utf8");
}
