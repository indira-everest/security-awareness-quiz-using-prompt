import fs from "fs";
import path from "path";
import Papa from "papaparse";

/**
 * Converts final CSV content → properly formatted GIFT text for Moodle import.
 * Metadata appears as comments above each question.
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

    // Extract options from the question text (lines starting with A), B), etc.)
    const optionRegex = /([A-D]\))\s*(.*?)(?=\s*[A-D]\)|$)/gs;
    const options: string[] = [];
    let match;
    while ((match = optionRegex.exec(question))) {
      const opt = `${match[1]} ${match[2].trim()}`;
      options.push(opt);
    }

    // Remove options from main question body
    const questionText = question.replace(optionRegex, "").trim();

    // Format options for Moodle GIFT
    const formattedOptions = options.length
      ? "{\n" +
        options
          .map((opt) => {
            const prefix = opt.includes(correctAnswer) ? "=" : "~";
            return `    ${prefix}${opt}`;
          })
          .join("\n") +
        "\n}"
      : "";

    // Build metadata as comments
    giftText += `// =====================================================\n`;
    giftText += `// Policy Section/Reference: ${section}\n`;
    giftText += `// Policy Alignment: ${alignment}\n`;
    giftText += `// Correctness of Answer: ${correctness}\n`;
    giftText += `// Clarity: ${clarity}\n`;
    giftText += `// Engagement/Fun: ${engagement}\n`;
    giftText += `// Accessibility/Readability: ${access}\n`;
    giftText += `// =====================================================\n\n`;

    // Append question in Moodle format
    giftText += `::${id || "Question"}::\n`;
    giftText += `${questionText}\n${formattedOptions}\n`;
    giftText += `[Explanation: ${explanation}]\n\n`;
  }

  return giftText.trim();
}

/**
 * Reads final CSV and writes a `.gift` file alongside it.
 */
export function writeGiftFile(finalCsvPath: string, outputDir: string): void {
  const csvContent = fs.readFileSync(finalCsvPath, "utf8");
  const giftContent = convertCsvToGift(csvContent);
  const giftPath = path.join(outputDir, "final_generated_questions.gift");
  fs.writeFileSync(giftPath, giftContent, "utf8");
  console.log(`🎁 GIFT file generated → ${giftPath}`);
}
