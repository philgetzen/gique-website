const fs = require('fs');
const path = require('path');

const imageList = require('./interview-images.json');

// Create mapping from original URLs to local filenames
const mapping = {};
imageList.forEach((url, index) => {
  mapping[url] = `/images/interviews/interview-${index + 1}.jpg`;
});

// Save mapping
fs.writeFileSync(
  path.join(__dirname, 'image-url-mapping.json'),
  JSON.stringify(mapping, null, 2)
);

console.log('✓ Created image URL mapping');
console.log(`  Mapped ${Object.keys(mapping).length} URLs to local images`);
