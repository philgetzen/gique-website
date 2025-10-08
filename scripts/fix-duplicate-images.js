import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the image mapping
const imageMapPath = path.join(__dirname, 'image-map.json');
const imageMap = JSON.parse(fs.readFileSync(imageMapPath, 'utf-8'));

// Function to extract hash from Squarespace URL
function getHashFromUrl(url) {
  const match = url.match(/\/(\d+-[A-Z0-9]+)\//);
  return match ? match[1] : null;
}

// Function to get file extension
function getExtension(url) {
  const filename = url.split('/').pop().split('?')[0];
  const ext = path.extname(filename);
  return ext || '.jpg'; // default to .jpg if no extension
}

// Find all duplicate filenames
const filenameGroups = {};
for (const [sourceUrl, localPath] of Object.entries(imageMap)) {
  const filename = path.basename(localPath);
  if (!filenameGroups[filename]) {
    filenameGroups[filename] = [];
  }
  filenameGroups[filename].push({ sourceUrl, localPath });
}

// Find duplicates (more than one URL maps to the same filename)
const duplicates = Object.entries(filenameGroups).filter(([filename, urls]) => urls.length > 1);

console.log(`\nFound ${duplicates.length} duplicate filenames:\n`);

// Create new unique mappings
const newImageMap = { ...imageMap };
const urlReplacements = {}; // Maps old local path to new local path

for (const [filename, urlList] of duplicates) {
  console.log(`📁 ${filename} (${urlList.length} different images):`);

  for (const { sourceUrl, localPath } of urlList) {
    const hash = getHashFromUrl(sourceUrl);
    const ext = getExtension(sourceUrl);

    if (hash) {
      // Create unique filename using hash
      const baseName = filename.replace(/\.(jpg|jpeg|png|gif)$/i, '');
      const newFilename = `${baseName}-${hash}${ext}`;
      const newLocalPath = `/images/general/${newFilename}`;

      console.log(`  - ${hash.substring(0, 15)}... → ${newFilename}`);

      // Update mappings
      newImageMap[sourceUrl] = newLocalPath;
      urlReplacements[sourceUrl] = newLocalPath;
    }
  }
  console.log('');
}

// Save new image map
fs.writeFileSync(imageMapPath, JSON.stringify(newImageMap, null, 2));

// Save URL replacements for the next script
const replacementsPath = path.join(__dirname, 'url-replacements.json');
fs.writeFileSync(replacementsPath, JSON.stringify(urlReplacements, null, 2));

console.log(`✅ Created new image map with unique filenames`);
console.log(`✅ Saved ${Object.keys(urlReplacements).length} URL replacements to url-replacements.json\n`);
