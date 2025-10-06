const fs = require('fs');
const path = require('path');

const mapping = require('./image-url-mapping.json');
const interviewsDir = path.join(__dirname, '../src/content/interviews');

const files = fs.readdirSync(interviewsDir).filter(f => f.endsWith('.md'));

let totalReplaced = 0;

files.forEach(file => {
  const filepath = path.join(interviewsDir, file);
  let content = fs.readFileSync(filepath, 'utf-8');
  let replaced = 0;

  // Replace each Squarespace CDN URL with local path
  Object.entries(mapping).forEach(([oldUrl, newPath]) => {
    const oldUrlEscaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(oldUrlEscaped, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newPath);
      replaced += matches.length;
    }
  });

  if (replaced > 0) {
    fs.writeFileSync(filepath, content);
    console.log(`✓ ${file}: Replaced ${replaced} image URLs`);
    totalReplaced += replaced;
  }
});

console.log(`\n✓ Total replacements: ${totalReplaced}`);
