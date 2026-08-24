// scripts/dump_problems.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read TypeScript file
const problemsTsPath = path.join(__dirname, '../src/lib/data/problems.ts');
let code = fs.readFileSync(problemsTsPath, 'utf8');

// Strip TypeScript annotations so it can be evaluated as pure JS
code = code
  .replace(/import\s+.*?;\s*/g, '')
  .replace(/export\s+const\s+PROBLEMS:\s*ProblemDefinition\[\]\s*=/g, 'const PROBLEMS =');

// Evaluate in sandbox
const fn = new Function(`${code}; return PROBLEMS;`);
const problems = fn();

const cacheDir = path.join(__dirname, '../.verify_cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

fs.writeFileSync(
  path.join(cacheDir, 'problems.json'),
  JSON.stringify(problems, null, 2),
  'utf8'
);

console.log(`Successfully exported ${problems.length} problems to .verify_cache/problems.json`);
