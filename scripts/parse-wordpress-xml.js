#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';

// Configuration
const XML_FILE_PATH = '/Users/philgetzen/Downloads/Squarespace Wordpress Export Oct 6 2025.xml';
const OUTPUT_BASE_DIR = './src/content';

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-'
});

// XML Parser configuration
const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: true,
  trimValues: true,
  cdataTagName: '__cdata',
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false,
  parseTagValue: true
};

/**
 * Parse WordPress XML file
 */
function parseXML(filePath) {
  console.log('📖 Reading WordPress XML file...');

  try {
    const xmlContent = readFileSync(filePath, 'utf-8');
    const parser = new XMLParser(parserOptions);
    const result = parser.parse(xmlContent);

    console.log('✅ XML parsed successfully');
    return result;
  } catch (error) {
    console.error('❌ Error parsing XML:', error.message);
    throw error;
  }
}

/**
 * Extract items from parsed XML
 */
function extractItems(parsedXml) {
  console.log('🔍 Extracting items from XML...');

  try {
    const channel = parsedXml.rss.channel;
    let items = channel.item;

    // Ensure items is always an array
    if (!Array.isArray(items)) {
      items = items ? [items] : [];
    }

    console.log(`✅ Found ${items.length} items`);
    return items;
  } catch (error) {
    console.error('❌ Error extracting items:', error.message);
    return [];
  }
}

/**
 * Generate slug from WordPress link
 */
function generateSlug(link) {
  if (!link) return 'untitled';

  // Extract path from link (e.g., "/home" from "https://www.gique.me/home")
  const url = new URL(link, 'https://www.gique.me');
  let slug = url.pathname.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes

  // If empty (homepage), use 'index'
  if (!slug) slug = 'index';

  return slug;
}

/**
 * Determine content type and directory based on slug
 */
function getContentTypeAndDir(slug) {
  const programPages = [
    'science-can-dance',
    'after-school-programs',
    'art-science-of-beer',
    'fab-fest',
    'art-of-code',
    'typography'
  ];

  if (slug.startsWith('interviews/')) {
    return { type: 'interviews', dir: 'interviews' };
  } else if (programPages.includes(slug)) {
    return { type: 'programs', dir: 'programs' };
  } else {
    return { type: 'pages', dir: 'pages' };
  }
}

/**
 * Extract image URLs from HTML content
 */
function extractImageUrls(htmlContent) {
  if (!htmlContent) return [];

  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const urls = [];
  let match;

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/**
 * Convert HTML to Markdown
 */
function convertToMarkdown(htmlContent) {
  if (!htmlContent) return '';

  try {
    // Handle CDATA if present
    let content = htmlContent;
    if (typeof content === 'object' && content.__cdata) {
      content = content.__cdata;
    }

    // Convert HTML to Markdown
    const markdown = turndownService.turndown(content);
    return markdown.trim();
  } catch (error) {
    console.warn('⚠️  Error converting HTML to Markdown:', error.message);
    return htmlContent;
  }
}

/**
 * Generate YAML frontmatter
 */
function generateFrontmatter(item, slug) {
  const title = item.title || 'Untitled';
  const date = item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const author = item['dc:creator'] || 'Unknown';

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${date}"
author: "${author}"
---`;

  return frontmatter;
}

/**
 * Write Markdown file
 */
function writeMarkdownFile(contentType, slug, frontmatter, markdownContent) {
  const { dir } = getContentTypeAndDir(slug);
  const outputDir = join(OUTPUT_BASE_DIR, dir);

  // Create directory if it doesn't exist
  try {
    mkdirSync(outputDir, { recursive: true });
  } catch (error) {
    // Directory may already exist, ignore
  }

  // Determine filename
  let filename;
  if (slug === 'index') {
    filename = 'home.md';
  } else if (slug.includes('/')) {
    // For nested paths like "interviews/interview-name"
    const parts = slug.split('/');
    filename = `${parts[parts.length - 1]}.md`;
  } else {
    filename = `${slug}.md`;
  }

  const filePath = join(outputDir, filename);
  const fullContent = `${frontmatter}\n\n${markdownContent}`;

  try {
    writeFileSync(filePath, fullContent, 'utf-8');
    console.log(`✅ Written: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error(`❌ Error writing file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Process a single item
 */
function processItem(item, index, total) {
  console.log(`\n📄 Processing item ${index + 1}/${total}`);

  try {
    // Extract link and generate slug
    const link = item.link || '';
    const slug = generateSlug(link);
    console.log(`   Slug: ${slug}`);

    // Extract content
    const htmlContent = item['content:encoded'] || '';

    // Extract image URLs
    const imageUrls = extractImageUrls(htmlContent);
    if (imageUrls.length > 0) {
      console.log(`   Found ${imageUrls.length} images`);
    }

    // Convert to Markdown
    const markdownContent = convertToMarkdown(htmlContent);

    // Generate frontmatter
    const frontmatter = generateFrontmatter(item, slug);

    // Determine content type
    const { type } = getContentTypeAndDir(slug);

    // Write file
    const filePath = writeMarkdownFile(type, slug, frontmatter, markdownContent);

    return {
      success: filePath !== null,
      slug,
      type,
      imageUrls,
      filePath
    };
  } catch (error) {
    console.error(`❌ Error processing item:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting WordPress XML to Markdown conversion\n');
  console.log('=' .repeat(60));

  try {
    // Parse XML
    const parsedXml = parseXML(XML_FILE_PATH);

    // Extract items
    const items = extractItems(parsedXml);

    if (items.length === 0) {
      console.log('⚠️  No items found in XML file');
      return;
    }

    // Process each item
    console.log('\n📝 Processing items...\n');
    console.log('=' .repeat(60));

    const results = items.map((item, index) =>
      processItem(item, index, items.length)
    );

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 Summary\n');

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Successfully processed: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    // Count by type
    const byType = successful.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📁 Content by type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} files`);
    });

    // Collect all image URLs
    const allImageUrls = successful
      .flatMap(r => r.imageUrls || [])
      .filter((url, index, self) => self.indexOf(url) === index); // Unique URLs

    console.log(`\n🖼️  Total unique images found: ${allImageUrls.length}`);

    // Write image manifest
    if (allImageUrls.length > 0) {
      const manifestPath = './scripts/image-urls.json';
      writeFileSync(manifestPath, JSON.stringify(allImageUrls, null, 2), 'utf-8');
      console.log(`✅ Image URLs saved to: ${manifestPath}`);
    }

    console.log('\n' + '=' .repeat(60));
    console.log('✨ Conversion complete!\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run main function
main();
