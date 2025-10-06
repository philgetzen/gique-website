#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import sharp from 'sharp';

// Configuration
const IMAGE_MANIFEST_PATH = './scripts/image-urls.json';
const OUTPUT_BASE_DIR = './public/images';
const MAX_WIDTH = 1920;
const QUALITY = 85;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Statistics
const stats = {
  total: 0,
  downloaded: 0,
  skipped: 0,
  failed: 0,
  optimized: 0
};

/**
 * Sleep function for retry delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sanitize filename to be filesystem safe
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

/**
 * Determine category from URL
 */
function getCategoryFromUrl(url) {
  const urlLower = url.toLowerCase();

  if (urlLower.includes('science-can-dance') || urlLower.includes('scd')) {
    return 'programs';
  } else if (urlLower.includes('art-of-code') || urlLower.includes('beer') || urlLower.includes('fab-fest') || urlLower.includes('typography')) {
    return 'programs';
  } else if (urlLower.includes('interview')) {
    return 'interviews';
  } else if (urlLower.includes('home') || urlLower.includes('gique_logo')) {
    return 'home';
  }

  return 'general';
}

/**
 * Download image with retry logic
 */
async function downloadImage(url, outputPath, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const fileStream = createWriteStream(outputPath);
      await pipeline(response.body, fileStream);

      return true;
    } catch (error) {
      if (attempt === retries) {
        console.error(`   ❌ Failed after ${retries} attempts: ${error.message}`);
        return false;
      }

      console.warn(`   ⚠️  Attempt ${attempt} failed, retrying in ${RETRY_DELAY/1000}s...`);
      await sleep(RETRY_DELAY);
    }
  }

  return false;
}

/**
 * Optimize image using Sharp
 */
async function optimizeImage(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    let pipeline = image;

    // Resize if too large
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Optimize based on format
    const ext = extname(outputPath).toLowerCase();

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: QUALITY, progressive: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: QUALITY });
    }

    // Save optimized image
    await pipeline.toFile(outputPath);

    return true;
  } catch (error) {
    console.error(`   ❌ Optimization failed: ${error.message}`);
    return false;
  }
}

/**
 * Get local path for image
 */
function getLocalImagePath(url) {
  const category = getCategoryFromUrl(url);

  // Extract filename from URL
  let filename;
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    filename = basename(pathname);

    // If filename doesn't have extension, try to get from format parameter
    if (!extname(filename)) {
      const format = urlObj.searchParams.get('format');
      if (format) {
        filename += `.${format}`;
      }
    }
  } catch (error) {
    // Fallback: use hash of URL
    filename = `image-${Buffer.from(url).toString('base64').substring(0, 16)}.jpg`;
  }

  filename = sanitizeFilename(filename);

  return {
    category,
    filename,
    relativePath: `/images/${category}/${filename}`,
    absolutePath: join(OUTPUT_BASE_DIR, category, filename)
  };
}

/**
 * Process a single image
 */
async function processImage(url, index, total) {
  const progress = `[${index + 1}/${total}]`;
  console.log(`\n${progress} Processing: ${url.substring(0, 80)}...`);

  const { category, filename, relativePath, absolutePath } = getLocalImagePath(url);
  console.log(`   📁 Category: ${category}`);
  console.log(`   📄 Filename: ${filename}`);

  // Check if already exists
  if (existsSync(absolutePath)) {
    console.log(`   ⏭️  Skipped (already exists)`);
    stats.skipped++;
    return { url, localPath: relativePath, skipped: true };
  }

  // Ensure directory exists
  const dir = join(OUTPUT_BASE_DIR, category);
  mkdirSync(dir, { recursive: true });

  // Download to temporary path
  const tempPath = `${absolutePath}.tmp`;
  console.log(`   ⬇️  Downloading...`);

  const downloaded = await downloadImage(url, tempPath);

  if (!downloaded) {
    stats.failed++;
    return { url, error: 'Download failed', failed: true };
  }

  stats.downloaded++;
  console.log(`   ✅ Downloaded`);

  // Optimize image
  console.log(`   🔧 Optimizing...`);
  const optimized = await optimizeImage(tempPath, absolutePath);

  if (optimized) {
    stats.optimized++;
    console.log(`   ✅ Optimized`);

    // Clean up temp file
    try {
      const fs = await import('fs/promises');
      await fs.unlink(tempPath);
    } catch (error) {
      // Temp file may already be gone
    }
  } else {
    // If optimization failed, keep the original
    const fs = await import('fs/promises');
    await fs.rename(tempPath, absolutePath);
    console.log(`   ⚠️  Using original (optimization failed)`);
  }

  return { url, localPath: relativePath, success: true };
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image download and optimization\n');
  console.log('=' .repeat(60));

  try {
    // Read image manifest
    console.log('📖 Reading image manifest...');
    const imageUrls = JSON.parse(readFileSync(IMAGE_MANIFEST_PATH, 'utf-8'));
    stats.total = imageUrls.length;

    console.log(`✅ Found ${stats.total} images to process\n`);
    console.log('=' .repeat(60));

    // Process each image
    const results = [];
    for (let i = 0; i < imageUrls.length; i++) {
      const result = await processImage(imageUrls[i], i, imageUrls.length);
      results.push(result);
    }

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 Summary\n');

    console.log(`Total images: ${stats.total}`);
    console.log(`✅ Downloaded: ${stats.downloaded}`);
    console.log(`🔧 Optimized: ${stats.optimized}`);
    console.log(`⏭️  Skipped (already existed): ${stats.skipped}`);
    console.log(`❌ Failed: ${stats.failed}`);

    // Save mapping for Markdown updates
    const imageMap = results
      .filter(r => r.success || r.skipped)
      .reduce((map, r) => {
        map[r.url] = r.localPath;
        return map;
      }, {});

    const mapPath = './scripts/image-map.json';
    writeFileSync(mapPath, JSON.stringify(imageMap, null, 2), 'utf-8');
    console.log(`\n💾 Image URL mapping saved to: ${mapPath}`);

    if (stats.failed > 0) {
      console.log('\n⚠️  Some images failed to download. Check errors above.');
    }

    console.log('\n' + '=' .repeat(60));
    console.log('✨ Image processing complete!\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run main function
main();
