const fs = require('fs');
const path = require('path');

const interviewsDir = path.join(__dirname, '../src/content/interviews');
const files = fs.readdirSync(interviewsDir).filter(f => f.endsWith('.md'));

const photos = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(interviewsDir, file), 'utf-8');
  const slug = file.replace('.md', '');

  // Find first image in markdown
  const imageMatch = content.match(/!\[.*?\]\((https:\/\/[^)]+)\)/);

  if (imageMatch) {
    photos[slug] = imageMatch[1];
  }
});

console.log(JSON.stringify(photos, null, 2));
