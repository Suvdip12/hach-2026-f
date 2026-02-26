const fs = require("fs");
const path = require("path");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;
  content = content.replace(/EasyCode/g, "EasyCode");
  content = content.replace(/easycode/g, "easycode");
  content = content.replace(/Easycode/g, "Easycode");
  content = content.replace(/easyCode/g, "easyCode");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${filePath}`);
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (
      [
        "node_modules",
        ".git",
        ".next",
        "public",
        ".gemini",
        "dist",
        "build",
        "out",
      ].includes(file)
    )
      continue;
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        processDir(fullPath);
      } else if (
        stat.isFile() &&
        /\.(js|ts|jsx|tsx|json|md|css|html)$/.test(file)
      ) {
        replaceInFile(fullPath);
      }
    } catch (e) {
      console.log(`Failed to process ${fullPath}: ${e.message}`);
    }
  }
}

processDir(__dirname);
console.log("Done.");
