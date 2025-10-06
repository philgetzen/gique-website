const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const profiles = [
  { name: 'ashli-davis', url: 'https://images.squarespace-cdn.com/content/v1/525f99bee4b09c141b6f8b0c/1439670634320-NPYTLSZG8T01GCQEVBO2/image-asset.jpeg?format=2500w' },
  { name: 'megan-cox', url: 'https://images.squarespace-cdn.com/content/v1/525f99bee4b09c141b6f8b0c/1439670827801-CQS1QO9W0B7QMN168JEV/image-asset.png?format=2500w' },
  { name: 'dario-gd', url: 'https://images.squarespace-cdn.com/content/v1/525f99bee4b09c141b6f8b0c/1439670550661-TG4RWPMSZNIRJOLF0ULN/image-asset.jpeg?format=2500w' },
  { name: 'owen-beane', url: 'https://images.squarespace-cdn.com/content/v1/525f99bee4b09c141b6f8b0c/1439670231384-0I72TVJ1H0VXQ6UUCCHW/image-asset.jpeg?format=2500w' },
  { name: 'sam-nicaise', url: 'https://images.squarespace-cdn.com/content/v1/525f99bee4b09c141b6f8b0c/1439670102565-X556CND3R191KFS8LP14/image-asset.jpeg?format=2500w' }
];

const outputDir = path.join(__dirname, 'public/images/interviews/profiles');

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function processProfiles() {
  for (const profile of profiles) {
    const filename = `${profile.name}.jpg`;
    const outputPath = path.join(outputDir, filename);

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${profile.name} (already exists)`);
      continue;
    }

    try {
      console.log(`📥 Downloading ${profile.name}...`);
      const buffer = await downloadImage(profile.url, filename);
      
      console.log(`🖼️  Optimizing ${profile.name}...`);
      await sharp(buffer)
        .resize(600, 600, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toFile(outputPath);
      
      console.log(`✅ Saved ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to process ${profile.name}:`, error.message);
    }
  }
  
  console.log('\n✨ Done!');
}

processProfiles();
