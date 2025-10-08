import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load URL replacements
const replacementsPath = path.join(__dirname, 'url-replacements.json');
const urlReplacements = JSON.parse(fs.readFileSync(replacementsPath, 'utf-8'));

// Function to replace URLs in a file
function replaceUrlsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let replacementCount = 0;

  // Iterate through each replacement
  for (const [sourceUrl, newLocalPath] of Object.entries(urlReplacements)) {
    // Create regex patterns to match various URL formats
    const urlVariations = [
      sourceUrl.replace('?format=original', ''),  // Base URL without format
      sourceUrl,  // With format=original
      sourceUrl.replace('?format=original', '?format=2500w'),
      sourceUrl.replace('?format=original', '?format=1500w'),
      sourceUrl.replace('?format=original', '?format=1000w'),
      sourceUrl.replace('?format=original', '?format=750w'),
      sourceUrl.replace('?format=original', '?format=500w'),
      sourceUrl.replace('https://', 'http://'),  // HTTP variant
      sourceUrl.replace('https://', 'http://').replace('?format=original', ''),
    ];

    // Replace all variations with the new local path
    urlVariations.forEach(url => {
      if (content.includes(url)) {
        const regex = new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);
        if (matches) {
          replacementCount += matches.length;
          content = content.replace(regex, newLocalPath);
        }
      }
    });
  }

  // Write the updated content back to the file
  if (replacementCount > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${path.basename(filePath)}: ${replacementCount} URLs updated`);
  }

  return replacementCount;
}

// Function to recursively find files
function findFiles(dir, extensions, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        findFiles(filePath, extensions, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Main execution
console.log('\n🔄 Updating image references to use unique hash-based filenames...\n');

const projectRoot = path.join(__dirname, '..');
const targetDirs = [
  path.join(projectRoot, 'src', 'pages'),
  path.join(projectRoot, 'src', 'content'),
  path.join(projectRoot, 'src', 'components'),
];

let totalReplacements = 0;
const extensions = ['.astro', '.md', '.mdx', '.tsx', '.jsx'];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Scanning ${path.relative(projectRoot, dir)}/...`);
    const files = findFiles(dir, extensions);

    files.forEach(file => {
      const count = replaceUrlsInFile(file);
      totalReplacements += count;
    });
    console.log('');
  }
});

console.log(`✅ Complete! Updated ${totalReplacements} image references.\n`);
console.log(`All images now use unique hash-based filenames.`);
console.log(`No more duplicate image conflicts!\n`);
