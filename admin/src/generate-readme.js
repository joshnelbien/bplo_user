import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = __dirname; // your project folder
const outputFile = path.join(projectRoot, "README.md");

// Recursive function to get folder structure
function readDirRecursive(dir, prefix = "") {
  const items = fs.readdirSync(dir);
  let result = "";
  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const isDir = fs.statSync(fullPath).isDirectory();
    const pointer = index === items.length - 1 ? "└── " : "├── ";
    result += `${prefix}${pointer}${item}\n`;
    if (isDir) {
      const newPrefix = prefix + (index === items.length - 1 ? "    " : "│   ");
      result += readDirRecursive(fullPath, newPrefix);
    }
  });
  return result;
}

// Generate folder structure
const structure = readDirRecursive(projectRoot);

// Write to README.md
const readmeContent = `# Project Structure

\`\`\`
${structure}
\`\`\`
`;

fs.writeFileSync(outputFile, readmeContent);
console.log("README.md generated with complete project structure!");
