import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the image mapping
const imageMapPath = path.join(__dirname, 'image-map.json');
const imageMap = JSON.parse(fs.readFileSync(imageMapPath, 'utf-8'));

// Function to replace URLs in a file
function replaceUrlsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let replacementCount = 0;

  // Iterate through each Squarespace URL in the map
  for (const [squarespaceUrl, localPath] of Object.entries(imageMap)) {
    // Create regex patterns to match various URL formats
    const urlVariations = [
      squarespaceUrl.replace('?format=original', ''),  // Base URL
      squarespaceUrl,  // With format=original
      squarespaceUrl.replace('?format=original', '?format=2500w'),
      squarespaceUrl.replace('?format=original', '?format=1500w'),
      squarespaceUrl.replace('?format=original', '?format=1000w'),
      squarespaceUrl.replace('?format=original', '?format=750w'),
      squarespaceUrl.replace('?format=original', '?format=500w'),
      squarespaceUrl.replace('https://', 'http://'),  // HTTP variant
      squarespaceUrl.replace('https://', 'http://').replace('?format=original', ''),
    ];

    // Replace all variations with the local path
    urlVariations.forEach(url => {
      if (content.includes(url)) {
        const regex = new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);
        if (matches) {
          replacementCount += matches.length;
          content = content.replace(regex, localPath);
        }
      }
    });
  }

  // Write the updated content back to the file
  if (replacementCount > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${filePath}: ${replacementCount} URLs replaced`);
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
      // Skip node_modules and dist directories
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
console.log('🔄 Replacing Squarespace CDN URLs with local image paths...\n');

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
  }
});

console.log(`\n✅ Complete! Replaced ${totalReplacements} image URLs across all files.`);
console.log(`\nAll Squarespace CDN URLs have been replaced with local paths.`);
console.log(`Images will now be served from your Cloudflare Pages deployment.`);
