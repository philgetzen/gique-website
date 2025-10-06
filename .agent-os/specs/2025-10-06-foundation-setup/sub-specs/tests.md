# Tests Specification

This is the tests coverage details for the spec detailed in @.agent-os/specs/2025-10-06-foundation-setup/spec.md

> Created: 2025-10-06
> Version: 1.0.0

## Test Coverage

### Unit Tests

**Content Parser (`scripts/parse-wordpress-xml.js`)**
- Test XML parsing with valid WordPress export
- Test XML parsing with malformed XML (should handle gracefully)
- Test HTML to Markdown conversion with various HTML elements
- Test frontmatter generation with complete item data
- Test frontmatter generation with missing fields (should provide defaults)
- Test slug generation from various link formats
- Test image URL extraction from HTML content
- Test special character handling in content

**Image Processor (`scripts/download-images.js`)**
- Test image download success case
- Test image download failure (network error)
- Test image optimization (Sharp processing)
- Test WebP conversion
- Test image resize for large images (>1920px)
- Test Markdown image reference updates
- Test skip already downloaded images logic

### Integration Tests

**Astro Build Process**
- Test `npm run build` completes successfully
- Test build output contains all expected pages
- Test build generates proper directory structure in `dist/`
- Test no build errors or warnings
- Test TypeScript compilation passes

**Content Migration Workflow**
- Test end-to-end: XML → Markdown files in correct locations
- Test end-to-end: Images downloaded and organized correctly
- Test Markdown files have valid frontmatter
- Test image references in Markdown point to correct local paths

**Navigation Component**
- Test navigation renders all expected links
- Test navigation links have correct hrefs
- Test mobile menu toggle functionality
- Test active state applies to current page
- Test keyboard navigation works (Tab, Enter)
- Test ARIA attributes present for accessibility

**Page Routing**
- Test all 13 main routes are accessible
- Test routes return 200 status
- Test routes match Squarespace URL structure exactly
- Test no trailing slashes in URLs
- Test 404 page for non-existent routes

### Feature Tests

**Local Development Startup**
- Scenario: Developer runs `npm install` → `npm run dev`
- Expected: Dev server starts on port 4321
- Expected: Homepage accessible at http://localhost:4321
- Expected: Hot reload works when files changed
- Expected: No console errors in browser

**Homepage Rendering**
- Scenario: Visit homepage in browser
- Expected: Page title displays "Gique"
- Expected: Mission statement visible
- Expected: Navigation component renders
- Expected: All navigation links clickable
- Expected: Page is responsive (mobile, tablet, desktop)
- Expected: Footer renders with social media placeholders

**Cloudflare Deployment**
- Scenario: Push code to GitHub main branch
- Expected: Cloudflare Pages triggers build automatically
- Expected: Build completes successfully
- Expected: Site accessible at Cloudflare staging URL
- Expected: All pages accessible via staging URL

**Content Files Generated**
- Scenario: Run content parser script
- Expected: Markdown files created in `src/content/pages/`
- Expected: Program content in `src/content/programs/`
- Expected: Interview content in `src/content/interviews/`
- Expected: All files have valid YAML frontmatter
- Expected: Content body contains Markdown formatted text

**Images Downloaded**
- Scenario: Run image download script
- Expected: Images saved in `public/images/` with organized subdirectories
- Expected: Images optimized (smaller file size than original)
- Expected: WebP versions created where applicable
- Expected: Image manifest JSON generated
- Expected: No broken image downloads (or logged warnings)

### Manual Testing Checklist

**Browser Compatibility**
- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Mobile Safari (iOS)
- [ ] Test on Mobile Chrome (Android)

**Responsive Design**
- [ ] Test mobile view (< 768px)
- [ ] Test tablet view (768px - 1024px)
- [ ] Test desktop view (> 1024px)
- [ ] Test navigation menu on mobile (hamburger menu)
- [ ] Test navigation menu on desktop (horizontal)

**Accessibility**
- [ ] Test keyboard-only navigation
- [ ] Test with screen reader (VoiceOver or NVDA)
- [ ] Verify alt text on images
- [ ] Verify proper heading hierarchy
- [ ] Verify color contrast meets WCAG AA standards

**Performance**
- [ ] Test page load time on dev server (< 1s)
- [ ] Test build time (reasonable for project size)
- [ ] Test image optimization (file sizes reduced)

## Mocking Requirements

**External Services**

- **Squarespace CDN:** Mock image downloads during tests
  - Create fixture images in test directory
  - Mock `fetch` or `axios` calls to return fixture data
  - Avoid hitting real CDN during automated tests

- **File System:** Mock file writes during unit tests
  - Use in-memory file system or temp directories
  - Clean up after each test
  - Avoid polluting actual project directories

- **GitHub API:** Not needed for Phase 1 tests

- **Cloudflare API:** Not needed for Phase 1 tests (deploy manually first)

## Test Data

**WordPress XML Fixture**
- Create minimal valid WordPress XML for tests
- Include various content types (pages, posts)
- Include edge cases (missing fields, special characters)
- Store in `tests/fixtures/wordpress-export.xml`

**Sample Images**
- Small test images for optimization tests
- Various formats (JPG, PNG, GIF)
- Store in `tests/fixtures/images/`

## Testing Tools

**Recommended:**
- **Vitest** - Fast unit testing framework (Astro's default)
- **Playwright** or **Cypress** - E2E testing for browser scenarios
- **axe-core** - Accessibility testing
- **lighthouse-ci** - Performance testing

**For Phase 1 (Minimal Approach):**
- Manual testing of all scenarios above
- Visual inspection of content migration accuracy
- Browser testing of homepage and navigation
- Automated testing can be added in Phase 2/3

## Success Criteria

All tests should pass before marking Phase 1 complete:
- [ ] Content parser successfully processes WordPress XML
- [ ] All Markdown files generated with valid frontmatter
- [ ] Images downloaded and optimized
- [ ] Astro build completes without errors
- [ ] Dev server runs and homepage renders
- [ ] Navigation works on desktop and mobile
- [ ] All 13 routes accessible
- [ ] Cloudflare deployment successful
- [ ] No console errors in browser
- [ ] Responsive design works across devices
