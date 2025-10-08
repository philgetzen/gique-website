import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the image map and URL replacements
const imageMapPath = path.join(__dirname, 'image-map.json');
const imageMap = JSON.parse(fs.readFileSync(imageMapPath, 'utf-8'));

const replacementsPath = path.join(__dirname, 'url-replacements.json');
const urlReplacements = JSON.parse(fs.readFileSync(replacementsPath, 'utf-8'));

// Create mapping from old local paths to new local paths
const pathReplacements = {};

for (const [sourceUrl, newLocalPath] of Object.entries(urlReplacements)) {
  // Find the old local path from the original image map
  // The urlReplacements already shows us what URLs changed
  // We need to find what local path those URLs were originally mapped to

  const oldLocalPath = imageMap[sourceUrl];

  // But wait - the imageMap now has the NEW paths!
  // We need to invert this logic. Let me check which URL variations map to old paths

  // Check if source URL has format parameter variations
  const baseUrl = sourceUrl.replace('?format=original', '');
  const variations = [
    baseUrl,
    baseUrl + '?format=original',
    baseUrl + '?format=2500w',
    baseUrl + '?format=1500w',
    baseUrl + '?format=1000w',
    baseUrl + '?format=750w',
    baseUrl + '?format=500w',
  ];

  // Check each variation to find which old path it might have used
  for (const variant of variations) {
    // Extract filename from new local path to determine what the old generic name was
    const newFilename = path.basename(newLocalPath);

    // Extract the hash to know which URL this is
    const hashMatch = newFilename.match(/-(\d+-[A-Z0-9]+)\./);
    if (hashMatch) {
      // Determine old generic filename
      let oldFilename;
      if (newFilename.startsWith('image-asset-')) {
        const ext = path.extname(newFilename);
        oldFilename = 'image-asset' + ext;
      } else if (newFilename.startsWith('img_9627-')) {
        oldFilename = 'img_9627.jpg';
      } else if (newFilename.startsWith('img_4573-')) {
        oldFilename = 'img_4573.jpg';
      } else if (newFilename.startsWith('img_7323-')) {
        oldFilename = 'img_7323.jpg';
      } else if (newFilename.startsWith('img_7897-')) {
        oldFilename = 'img_7897.jpg';
      } else if (newFilename.startsWith('kristina_hagman-')) {
        oldFilename = 'kristina_hagman.jpg';
      } else if (newFilename.startsWith('screen-shot-2014-05-13-at-4.07.37-am-')) {
        oldFilename = 'screen-shot-2014-05-13-at-4.07.37-am.png';
      }

      if (oldFilename) {
        const oldLocalPath = '/images/general/' + oldFilename;

        // Only add if this exact source URL->old path mapping exists
        if (!pathReplacements[oldLocalPath]) {
          pathReplacements[oldLocalPath] = {};
        }
        // Store source URL as the key under this old path
        pathReplacements[oldLocalPath][sourceUrl] = newLocalPath;
      }
    }
  }
}

// Save the path replacements
const pathReplacementsFile = path.join(__dirname, 'path-replacements.json');
fs.writeFileSync(pathReplacementsFile, JSON.stringify(pathReplacements, null, 2));

console.log(`\n✅ Created path replacements mapping:`);
console.log(`   Old generic paths: ${Object.keys(pathReplacements).length}`);

let totalMappings = 0;
for (const mappings of Object.values(pathReplacements)) {
  totalMappings += Object.keys(mappings).length;
}
console.log(`   Total URL->path mappings: ${totalMappings}\n`);
