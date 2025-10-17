import fs from "fs";
import path from "path";
import PDFParser from "pdf2json";

/**
 * Ensures the directory exists, creates it if not.
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

export async function readFileContent(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const pages = pdfData.Pages;
        const text = pages
          .map((page) =>
            page.Texts.map((t) =>
              decodeURIComponent(t.R.map((r) => r.T).join(""))
            ).join(" ")
          )
          .join("\n\n");
        resolve(text);
      });

      pdfParser.loadPDF(filePath);
    });
  } else if (ext === ".txt") {
    return fs.readFileSync(filePath, "utf8");
  } else {
    throw new Error(`Unsupported file type: ${filePath}`);
  }
}

/**
 * Returns all .pdf and .txt files in a directory.
 */
export function getPolicyFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".pdf") || f.endsWith(".txt"));
}

/**
 * Writes a file to disk.
 */
export function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✅ Saved file: ${filePath}`);
}
