# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/specs/2025-10-06-foundation-setup/spec.md

> Created: 2025-10-06
> Status: Ready for Implementation

## Tasks

- [x] 1. Initialize Astro project with Tailwind CSS
  - [x] 1.1 Run `npm create astro@latest` with appropriate options
  - [x] 1.2 Configure Astro for static site generation in `astro.config.mjs`
  - [x] 1.3 Install and configure Tailwind CSS integration
  - [x] 1.4 Set up TypeScript configuration with strict mode
  - [x] 1.5 Create basic directory structure (`src/components/`, `src/content/`, `public/images/`, `scripts/`)
  - [x] 1.6 Add necessary npm scripts to `package.json` (dev, build, preview)
  - [x] 1.7 Test local development server starts successfully (`npm run dev`)
  - [x] 1.8 Verify build process works (`npm run build`)

- [ ] 2. Create WordPress XML content parsing script
  - [ ] 2.1 Create `scripts/parse-wordpress-xml.js` file
  - [ ] 2.2 Implement XML file reading and parsing
  - [ ] 2.3 Implement item extraction from XML structure
  - [ ] 2.4 Install and configure `turndown` for HTML to Markdown conversion
  - [ ] 2.5 Implement frontmatter generation from WordPress metadata
  - [ ] 2.6 Implement slug generation from WordPress links
  - [ ] 2.7 Create output directory structure for different content types
  - [ ] 2.8 Implement file writing with proper encoding
  - [ ] 2.9 Add error handling and logging
  - [ ] 2.10 Test script with WordPress XML export file
  - [ ] 2.11 Verify all Markdown files generated correctly

- [ ] 3. Extract and organize content from WordPress XML
  - [ ] 3.1 Run parsing script on `/Users/philgetzen/Downloads/Squarespace Wordpress Export Oct 6 2025.xml`
  - [ ] 3.2 Review generated Markdown files for accuracy
  - [ ] 3.3 Organize files into appropriate directories (pages, programs, interviews)
  - [ ] 3.4 Verify frontmatter contains all necessary fields
  - [ ] 3.5 Check for any parsing errors or malformed content
  - [ ] 3.6 Create content inventory document listing all extracted pages
  - [ ] 3.7 Commit organized content to version control

- [ ] 4. Create image download and optimization script
  - [ ] 4.1 Create `scripts/download-images.js` file
  - [ ] 4.2 Install `sharp` for image processing
  - [ ] 4.3 Implement image URL extraction from Markdown files
  - [ ] 4.4 Implement image download function with retry logic
  - [ ] 4.5 Implement image optimization (resize, compress, WebP conversion)
  - [ ] 4.6 Create organized directory structure in `public/images/`
  - [ ] 4.7 Implement progress indicator for downloads
  - [ ] 4.8 Update Markdown files with local image references
  - [ ] 4.9 Generate image manifest JSON
  - [ ] 4.10 Add error handling for failed downloads

- [ ] 5. Download and optimize all images from Squarespace
  - [ ] 5.1 Run image download script
  - [ ] 5.2 Monitor download progress and handle any failures
  - [ ] 5.3 Verify all images downloaded successfully
  - [ ] 5.4 Check image optimization results (file sizes reduced)
  - [ ] 5.5 Verify image references updated in Markdown files
  - [ ] 5.6 Review images manually for quality
  - [ ] 5.7 Commit images and manifest to version control

- [ ] 6. Create site structure with all page routes
  - [ ] 6.1 Create `src/pages/index.astro` (homepage)
  - [ ] 6.2 Create `src/pages/about-us.astro`
  - [ ] 6.3 Create `src/pages/steam-resources.astro`
  - [ ] 6.4 Create `src/pages/science-can-dance.astro`
  - [ ] 6.5 Create `src/pages/after-school-programs.astro`
  - [ ] 6.6 Create `src/pages/art-science-of-beer.astro`
  - [ ] 6.7 Create `src/pages/fab-fest.astro`
  - [ ] 6.8 Create `src/pages/art-of-code.astro`
  - [ ] 6.9 Create `src/pages/typography.astro`
  - [ ] 6.10 Create `src/pages/interviews/index.astro`
  - [ ] 6.11 Create `src/pages/press.astro`
  - [ ] 6.12 Create `src/pages/contact.astro`
  - [ ] 6.13 Create `src/pages/social.astro`
  - [ ] 6.14 Add placeholder content to each page
  - [ ] 6.15 Verify all routes accessible locally

- [ ] 7. Create responsive navigation component
  - [ ] 7.1 Create `src/components/Navigation.astro`
  - [ ] 7.2 Implement navigation links array with all main sections
  - [ ] 7.3 Style desktop navigation (horizontal layout)
  - [ ] 7.4 Implement mobile hamburger menu with Tailwind
  - [ ] 7.5 Add JavaScript for mobile menu toggle
  - [ ] 7.6 Implement active page highlighting
  - [ ] 7.7 Add ARIA attributes for accessibility
  - [ ] 7.8 Test responsive breakpoints (mobile, tablet, desktop)
  - [ ] 7.9 Test keyboard navigation
  - [ ] 7.10 Verify navigation works on all pages

- [ ] 8. Create base layout and homepage
  - [ ] 8.1 Create `src/components/Layout.astro` with common structure
  - [ ] 8.2 Implement head section with meta tags
  - [ ] 8.3 Include Navigation component in layout
  - [ ] 8.4 Create `src/components/Footer.astro` with social media placeholders
  - [ ] 8.5 Design homepage hero section with mission statement
  - [ ] 8.6 Add Gique branding/logo to homepage
  - [ ] 8.7 Add brief description from existing site
  - [ ] 8.8 Style homepage with Tailwind CSS
  - [ ] 8.9 Ensure homepage is fully responsive
  - [ ] 8.10 Test homepage rendering locally

- [ ] 9. Set up GitHub repository
  - [ ] 9.1 Initialize Git repository (`git init`)
  - [ ] 9.2 Create `.gitignore` file (node_modules, dist, .env, .DS_Store)
  - [ ] 9.3 Create GitHub repository (public or private)
  - [ ] 9.4 Add remote origin
  - [ ] 9.5 Create initial commit with all Phase 1 work
  - [ ] 9.6 Push to GitHub main branch
  - [ ] 9.7 Verify repository contents on GitHub

- [ ] 10. Connect Cloudflare Pages and deploy
  - [ ] 10.1 Log into Cloudflare account
  - [ ] 10.2 Navigate to Pages section
  - [ ] 10.3 Create new project connected to GitHub repository
  - [ ] 10.4 Configure build settings (build command: `npm run build`, output: `dist`)
  - [ ] 10.5 Set Node.js version to 18 or 20
  - [ ] 10.6 Trigger initial deployment
  - [ ] 10.7 Monitor build logs for errors
  - [ ] 10.8 Verify deployment successful
  - [ ] 10.9 Visit Cloudflare Pages staging URL
  - [ ] 10.10 Test all routes on staging site
  - [ ] 10.11 Enable automatic deployments on push

- [ ] 11. Final Phase 1 verification and documentation
  - [ ] 11.1 Test complete local development workflow
  - [ ] 11.2 Verify all 13 routes accessible locally and on staging
  - [ ] 11.3 Test navigation on desktop and mobile
  - [ ] 11.4 Verify all content files extracted correctly
  - [ ] 11.5 Verify all images downloaded and optimized
  - [ ] 11.6 Run accessibility check on homepage
  - [ ] 11.7 Test browser compatibility (Chrome, Firefox, Safari)
  - [ ] 11.8 Create README.md with setup instructions
  - [ ] 11.9 Document any issues or edge cases encountered
  - [ ] 11.10 Update roadmap to mark Phase 1 complete
