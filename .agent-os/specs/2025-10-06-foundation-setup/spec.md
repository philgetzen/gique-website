# Spec Requirements Document

> Spec: Phase 1 - Foundation & Setup
> Created: 2025-10-06
> Status: Planning

## Overview

Establish the technical foundation for the gique.me website migration by initializing the Astro project, parsing all content from the Squarespace WordPress export, and creating the basic site structure needed for Phase 2 implementation. This phase provides the development environment, content extraction pipeline, and routing architecture that all subsequent work will build upon.

## User Stories

### Content Creator Publishing Migration

As a website owner, I want all existing content automatically extracted from Squarespace into organized Markdown files, so that I can review and edit content in a portable, version-controlled format without manual copy-paste work.

**Workflow:** Owner runs content parsing script → Script reads WordPress XML export → Extracts all pages, posts, images, and metadata → Generates structured Markdown files organized by content type → Owner reviews extracted content for accuracy → Content ready for Phase 2 page implementation.

### Developer Starting Local Development

As a developer, I want a fully configured Astro project with Tailwind CSS and proper routing, so that I can immediately start building pages without setup overhead.

**Workflow:** Developer clones repository → Runs `npm install` → Runs `npm run dev` → Local dev server starts → Views basic homepage at localhost → Navigates between page routes → Makes changes and sees hot reload → Ready to implement Phase 2 pages.

### Site Visitor Accessing Future Website

As a site visitor, I want to see a basic homepage with navigation that shows the site structure, so that I understand what content will be available when the full site launches.

**Workflow:** Visitor navigates to staging URL → Sees clean homepage with Gique branding → Views responsive navigation menu listing all main sections → Clicks navigation links to see placeholder pages → Understands site structure and upcoming content.

## Spec Scope

1. **Astro Project Initialization** - Create new Astro project with Tailwind CSS, proper TypeScript configuration, and development scripts
2. **Content Parsing Script** - Build Node.js script to parse WordPress XML export and generate organized Markdown files for all pages and content
3. **Image Extraction & Optimization** - Download all images from Squarespace CDN, optimize for web, and organize by content section
4. **Site Structure & Routing** - Create page files for all 13 main URLs matching Squarespace structure to preserve SEO
5. **Navigation Component** - Implement responsive header navigation with mobile menu matching all site sections
6. **GitHub & Cloudflare Setup** - Initialize Git repository, push to GitHub, and connect to Cloudflare Pages for automatic deployments
7. **Basic Homepage** - Create functional homepage with mission statement, logo, and navigation to demonstrate site structure

## Out of Scope

- Full page content implementation (Phase 2)
- Image galleries and video embeds (Phase 2)
- Final design polish and styling (Phase 3)
- SEO meta tags and sitemap (Phase 4)
- Contact page functionality (Phase 2)
- Social media links page (Phase 2)
- Interview sub-pages detailed content (Phase 2)

## Expected Deliverable

1. **Functional Local Development**: Running `npm run dev` shows homepage at localhost:4321 with working navigation to all 13 main page routes
2. **Content Extracted**: All text content from WordPress XML export organized into Markdown files in `/src/content/` directory
3. **Images Organized**: All Squarespace images downloaded and optimized in `/public/images/` directory with clear naming structure
4. **Cloudflare Deployment**: GitHub repository connected to Cloudflare Pages with automatic deployments on push to main branch
5. **Browser Testable**: Visiting Cloudflare Pages staging URL shows basic homepage with navigation, all routes accessible (even if showing placeholder content)

## Spec Documentation

- Tasks: @.agent-os/specs/2025-10-06-foundation-setup/tasks.md
- Technical Specification: @.agent-os/specs/2025-10-06-foundation-setup/sub-specs/technical-spec.md
- Tests Specification: @.agent-os/specs/2025-10-06-foundation-setup/sub-specs/tests.md
