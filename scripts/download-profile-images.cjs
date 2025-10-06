const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const profileImages = require('./all-profile-images.json');
const outputDir = path.join(__dirname, '../public/images/interviews/profiles');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);

          // Optimize image with Sharp
          await sharp(buffer)
            .resize(600, 600, { fit: 'cover' })
            .jpeg({ quality: 85 })
            .toFile(path.join(outputDir, filename));

          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function downloadAll() {
  const entries = Object.entries(profileImages);
  console.log(`Downloading ${entries.length} profile images...\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [slug, url] of entries) {
    const filename = `${slug}.jpg`;
    const filepath = path.join(outputDir, filename);

    if (fs.existsSync(filepath)) {
      console.log(`✓ Skipped (exists): ${filename}`);
      skipped++;
      continue;
    }

    try {
      await downloadImage(url, filename);
      console.log(`✓ Downloaded: ${filename}`);
      downloaded++;
    } catch (err) {
      console.error(`✗ Failed: ${filename} - ${err.message}`);
      failed++;
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n✓ Downloaded: ${downloaded}`);
  console.log(`✓ Skipped: ${skipped}`);
  console.log(`✗ Failed: ${failed}`);
}

downloadAll();
