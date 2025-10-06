// This script will generate the TypeScript code for the interviews landing page
const fs = require('fs');
const path = require('path');

const profileImages = require('./all-profile-images.json');
const interviewsDir = path.join(__dirname, '../src/content/interviews');

// Get all interview files
const interviews = fs.readdirSync(interviewsDir)
  .filter(f => f.endsWith('.md'))
  .map(f => {
    const slug = f.replace('.md', '');
    const content = fs.readFileSync(path.join(interviewsDir, f), 'utf-8');

    // Extract title from frontmatter
    const titleMatch = content.match(/^title: ["'](.+?)["']/m);
    const title = titleMatch ? titleMatch[1] : slug;

    // Extract a snippet for description
    const lines = content.split('\n');
    let description = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#') && !line.includes('---') && line.length > 3) {
        // Skip the first heading, find the next paragraph
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.startsWith('#') && !nextLine.startsWith('!') && nextLine.length > 20) {
            description = nextLine.substring(0, 100);
            break;
          }
        }
        break;
      }
    }

    return { slug, title, description, hasImage: !!profileImages[slug] };
  })
  .filter(i => !i.slug.match(/^[a-z0-9]{20,}$/)); // Filter out hash slugs

console.log(`Found ${interviews.length} interviews`);
console.log(`With images: ${interviews.filter(i => i.hasImage).length}`);
console.log(`\nInterviews:`);
interviews.forEach(i => {
  console.log(`- ${i.title} (${i.slug}) ${i.hasImage ? '✓' : '✗'}`);
});
