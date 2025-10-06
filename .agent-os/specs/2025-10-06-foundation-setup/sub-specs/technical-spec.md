# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-10-06-foundation-setup/spec.md

> Created: 2025-10-06
> Version: 1.0.0

## Technical Requirements

### 1. Astro Project Setup

- **Framework Version:** Astro 4.15+ (latest stable)
- **TypeScript:** Enabled with strict mode
- **Package Manager:** npm (consistent with user's existing workflow)
- **Node.js:** v18.x or v20.x LTS
- **Build Target:** Static site (no SSR needed)

**Configuration Requirements:**
- Astro config for static build output
- Tailwind CSS integration with content paths configured
- Image optimization enabled (`@astrojs/image`)
- Development server port: 4321 (default)
- Build output directory: `dist/`

### 2. WordPress XML Parsing

- **Input:** `/Users/philgetzen/Downloads/Squarespace Wordpress Export Oct 6 2025.xml` (880KB)
- **Parser Library:** Use Node.js built-in XML parser or `fast-xml-parser` for better performance
- **Output Format:** Markdown files with YAML frontmatter

**Content Structure to Extract:**
```xml
<item>
  <title> → Frontmatter: title
  <link> → Used for routing/slug
  <content:encoded> → Main content body
  <pubDate> → Frontmatter: date
  <wp:author> → Frontmatter: author
</item>
```

**Parsing Requirements:**
- Handle CDATA sections properly
- Extract HTML from `<content:encoded>` and convert to Markdown
- Parse image URLs from content for download list
- Handle special characters and encoding (UTF-8)
- Generate slugs from `<link>` paths

### 3. Image Processing

**Image Sources:**
- Extract URLs from WordPress XML `<content:encoded>` sections
- Squarespace CDN format: `https://images.squarespace-cdn.com/...`

**Processing Pipeline:**
1. Download images from Squarespace CDN
2. Optimize using Sharp library:
   - Compress to WebP format (fallback to original)
   - Resize large images (max 1920px width)
   - Quality: 85%
3. Organize by content section in `/public/images/`
4. Update Markdown image references to local paths

**Directory Structure:**
```
public/
└── images/
    ├── home/
    ├── programs/
    ├── interviews/
    └── general/
```

### 4. Site Routing Structure

**Pages Directory (`src/pages/`):**
```
src/pages/
├── index.astro              → /
├── about-us.astro           → /about-us
├── steam-resources.astro    → /steam-resources
├── science-can-dance.astro  → /science-can-dance
├── after-school-programs.astro → /after-school-programs
├── art-science-of-beer.astro → /art-science-of-beer
├── fab-fest.astro           → /fab-fest
├── art-of-code.astro        → /art-of-code
├── typography.astro         → /typography
├── interviews/
│   └── index.astro          → /interviews
├── press.astro              → /press (note: called "In the News" but URL is /press)
├── contact.astro            → /contact
└── social.astro             → /social
```

**Routing Requirements:**
- Exact URL preservation from Squarespace
- No trailing slashes in URLs
- Interview sub-pages handled dynamically in Phase 2

### 5. Navigation Component

**Component Structure:**
```typescript
// src/components/Navigation.astro
interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about-us' },
  { label: 'STEAM Resources', href: '/steam-resources' },
  // ... all main sections
];
```

**Features:**
- Responsive desktop navigation (horizontal)
- Mobile hamburger menu (< 768px)
- Active state highlighting current page
- Dropdown for Programs subsection (optional)
- Accessible (keyboard navigation, ARIA labels)

**Styling:**
- Tailwind CSS classes
- Mobile-first responsive design
- Smooth transitions for menu open/close

### 6. Content Organization

**Directory Structure:**
```
src/
├── content/
│   ├── pages/
│   │   ├── about-us.md
│   │   ├── steam-resources.md
│   │   └── ...
│   ├── programs/
│   │   ├── science-can-dance.md
│   │   ├── after-school-programs.md
│   │   └── ...
│   └── interviews/
│       ├── interview-1.md
│       └── ...
├── components/
│   ├── Navigation.astro
│   ├── Layout.astro
│   └── Footer.astro
└── pages/
    └── [routing structure above]
```

**Markdown Frontmatter Schema:**
```yaml
---
title: "Page Title"
slug: "page-slug"
date: "2025-10-06"
author: "Phil Getzen"
description: "Brief page description"
---
```

### 7. GitHub & Cloudflare Pages Setup

**GitHub Configuration:**
- Repository name: `gique-website` or similar
- Branch strategy: `main` for production
- `.gitignore` includes: `node_modules/`, `dist/`, `.env`, `.DS_Store`

**Cloudflare Pages Configuration:**
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: 18 or 20
- Environment variables: None required for Phase 1
- Branch deployments: Enable for automatic preview URLs

**Deploy Trigger:**
- Automatic deployment on push to `main`
- Preview deployments for pull requests

## Approach Options

### Option A: Manual XML Parsing with Built-in Parser (Selected)

**Pros:**
- No external dependencies for parsing
- Full control over parsing logic
- Lightweight
- Good for one-time migration script

**Cons:**
- More verbose code
- Manual DOM traversal

**Rationale:** Since this is a one-time content migration and the XML structure is straightforward, using Node.js built-in XML parsing keeps dependencies minimal while providing sufficient control.

### Option B: Use Dedicated WordPress Import Tool

**Pros:**
- Purpose-built for WordPress exports
- Handles edge cases automatically

**Cons:**
- Additional dependency
- May include unnecessary features
- Overkill for our simple needs

## External Dependencies

### Core Dependencies

**@astrojs/tailwind** - v5.1+
- Purpose: Tailwind CSS integration with Astro
- Justification: Official Astro integration, zero-config setup, excellent DX

**tailwindcss** - v3.4+
- Purpose: Utility-first CSS framework
- Justification: Specified in tech stack, enables rapid responsive design

**sharp** - v0.33+
- Purpose: Image optimization and processing
- Justification: Industry standard, excellent performance, supports WebP conversion

**turndown** - v7.2+
- Purpose: HTML to Markdown conversion
- Justification: Robust conversion of WordPress HTML content to Markdown format

### Development Dependencies

**@types/node** - Latest
- Purpose: TypeScript types for Node.js
- Justification: Better DX with type checking in scripts

## Implementation Details

### Content Parsing Script

**Location:** `scripts/parse-wordpress-xml.js`

**Key Functions:**
1. `parseXML(filePath)` - Read and parse WordPress XML
2. `extractItems(xmlDoc)` - Extract all `<item>` elements
3. `convertToMarkdown(htmlContent)` - Convert HTML to Markdown
4. `generateFrontmatter(item)` - Create YAML frontmatter
5. `writeMarkdownFile(content, outputPath)` - Write to file system
6. `extractImageUrls(htmlContent)` - Find all image URLs

**Error Handling:**
- Graceful failure for malformed XML
- Log warnings for missing fields
- Continue processing on individual item failures

### Image Download Script

**Location:** `scripts/download-images.js`

**Key Functions:**
1. `downloadImage(url, outputPath)` - Fetch and save image
2. `optimizeImage(inputPath)` - Process with Sharp
3. `updateMarkdownImageRefs(mdPath, imageMap)` - Update references

**Features:**
- Retry logic for failed downloads
- Progress indication
- Skip already downloaded images
- Generate image manifest JSON

### Basic Homepage

**Content:**
- Gique logo/branding
- Mission statement: "Empowering youth through hands-on learning in science, tech, engineering, art & math (STEAM)"
- Brief description (from existing site)
- Full navigation component
- Footer with social media links placeholder

**Styling:**
- Clean, minimal design
- Responsive layout
- Use Tailwind CSS
- Placeholder for hero image

## Performance Considerations

- Static generation ensures fast page loads
- Image optimization reduces bandwidth
- Minimal JavaScript (Astro islands architecture)
- Efficient build times with content caching

## Security Considerations

- No server-side code = no server vulnerabilities
- Static files only
- Cloudflare CDN provides DDoS protection
- HTTPS enforced via Cloudflare

## Browser Compatibility

- Modern browsers (last 2 versions)
- Progressive enhancement approach
- Mobile-first responsive design
- No IE11 support needed
