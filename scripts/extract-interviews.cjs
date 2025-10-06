const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const xmlPath = '/Users/philgetzen/Downloads/Squarespace Wordpress Export Oct 6 2025.xml';
const xmlContent = fs.readFileSync(xmlPath, 'utf-8');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true
});

const result = parser.parse(xmlContent);
const items = result.rss.channel.item;

const interviews = [];
const imageUrls = new Set();

items.forEach(item => {
  const postName = item['wp:post_name'];
  const title = item.title || 'Untitled';

  // Match interview posts - either direct names or interview-series-draft paths
  const isInterview = (
    ['niharika-vattikonda', 'sara-molcan', 'suelin-chen', 'shantell-martin',
     'owen-beane', 'zach-lanoue', 'megan-cox'].includes(postName) ||
    (postName && postName.includes('interview-series-draft/') &&
     postName !== 'interview-series-draft/2016/6/16/megan-cox') // Skip duplicate
  );

  if (isInterview) {
    const content = item['content:encoded'] || '';
    const date = item.pubDate || item['wp:post_date'] || '';

    // Create a clean slug from the post name
    let slug = postName;
    if (postName.includes('interview-series-draft/')) {
      // Extract the last part of the path as the slug
      const parts = postName.split('/');
      slug = parts[parts.length - 1];
    }

    // Extract images from content
    const imgRegex = /src="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      imageUrls.add(match[1]);
    }

    // Convert HTML to Markdown
    const markdown = turndownService.turndown(content);

    interviews.push({
      slug: slug,
      title: title,
      date: date,
      content: markdown
    });

    console.log(`Found interview: ${title} (${slug})`);
  }
});

// Save interviews
const interviewsDir = path.join(__dirname, '../src/content/interviews');
if (!fs.existsSync(interviewsDir)) {
  fs.mkdirSync(interviewsDir, { recursive: true });
}

interviews.forEach(interview => {
  const frontmatter = `---
title: "${interview.title}"
slug: "${interview.slug}"
date: "${interview.date}"
author: "Gique"
---

`;

  const filePath = path.join(interviewsDir, `${interview.slug}.md`);
  fs.writeFileSync(filePath, frontmatter + interview.content);
  console.log(`Created: ${filePath}`);
});

// Save image URLs
const imageList = Array.from(imageUrls);
fs.writeFileSync(
  path.join(__dirname, 'interview-images.json'),
  JSON.stringify(imageList, null, 2)
);

console.log(`\n✓ Extracted ${interviews.length} interviews`);
console.log(`✓ Found ${imageList.length} images`);
console.log(`\nImage URLs saved to: scripts/interview-images.json`);
