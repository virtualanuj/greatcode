// scripts/extract_problems.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const problemsFilePath = path.join(__dirname, '../src/lib/data/problems.ts');
const fileContent = fs.readFileSync(problemsFilePath, 'utf8');

// Use regex extraction to parse problem objects cleanly
const problemsExportMatch = fileContent.match(/export const PROBLEMS: ProblemDefinition\[\] = (\[[\s\S]*?\]);\s*$/);

if (!problemsExportMatch) {
  console.error("Could not locate PROBLEMS export in src/lib/data/problems.ts");
  process.exit(1);
}

// Convert TypeScript data to valid JSON
let rawArrayStr = problemsExportMatch[1];

// Clean trailing commas and parse
const cleaned = rawArrayStr
  .replace(/\/\/.*$/gm, '') // remove line comments
  .replace(/,(\s*[\]}])/g, '$1'); // remove trailing commas

// Write temporary JSON dump for python verification harness
const tempDir = path.join(__dirname, '../.verify_cache');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Alternatively, let's write a direct exporter that imports the module using tsx or node
const outputPath = path.join(tempDir, 'problems.json');

// Write a simple runner script that bundles and extracts PROBLEMS
fs.writeFileSync(path.join(tempDir, 'raw_data.txt'), rawArrayStr);

console.log("Problems raw dataset extracted to .verify_cache/");
