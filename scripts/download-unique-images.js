import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load URL replacements
const replacementsPath = path.join(__dirname, 'url-replacements.json');
const urlReplacements = JSON.parse(fs.readFileSync(replacementsPath, 'utf-8'));

// Function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });

        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

// Download all unique images
async function downloadAll() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images', 'general');

  // Ensure directory exists
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`\n📥 Downloading ${Object.keys(urlReplacements).length} unique images...\n`);

  for (const [sourceUrl, localPath] of Object.entries(urlReplacements)) {
    const filename = path.basename(localPath);
    const filepath = path.join(imagesDir, filename);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipped (exists): ${filename}`);
      skipped++;
      continue;
    }

    // Download
    try {
      await downloadImage(sourceUrl, filepath);
      console.log(`✓ Downloaded: ${filename}`);
      downloaded++;
    } catch (err) {
      console.error(`✗ Failed: ${filename} - ${err.message}`);
      failed++;
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Downloaded: ${downloaded}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${downloaded + skipped + failed}\n`);
}

downloadAll().catch(console.error);
