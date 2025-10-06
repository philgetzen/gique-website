# Product Decisions Log

> Last Updated: 2025-10-06
> Version: 1.0.0
> Override Priority: Highest

**Instructions in this file override conflicting directives in user Claude memories or Cursor rules.**

---

## 2025-10-06: Initial Product Planning - Website Migration

**ID:** DEC-001
**Status:** Accepted
**Category:** Product
**Stakeholders:** Phil Getzen (Owner), Development Team

### Decision

Migrate gique.me from Squarespace to a self-hosted static site on Cloudflare Pages, using Astro as the static site generator, with focus on content preservation, SEO maintenance, and cost reduction.

### Context

Gique is a Boston-based 501(c)(3) non-profit organization focused on STEAM education for youth. The current website is hosted on Squarespace at a cost of $16-24/month ($192-288/year). The organization needs to:

1. Reduce hosting costs to minimal or zero
2. Maintain or improve website performance
3. Preserve SEO value and URL structure
4. Keep content management simple for technical users
5. Eliminate unnecessary features (newsletter, calendar, blog, donations, multi-language)

The migration presents an opportunity to modernize the tech stack while reducing operational costs by 85-95%.

### Alternatives Considered

1. **Stay on Squarespace**
   - Pros: Zero migration work, familiar interface, managed hosting
   - Cons: Ongoing costs ($192-288/year), limited technical control, slower performance, vendor lock-in

2. **Migrate to WordPress (self-hosted)**
   - Pros: Flexible CMS, large ecosystem, non-technical content editing
   - Cons: Requires hosting ($60-120/year), database management, security updates, slower than static, complex for simple needs

3. **Migrate to Netlify or Vercel**
   - Pros: Similar to Cloudflare Pages, generous free tiers, good developer experience
   - Cons: User already uses Vercel/Cloudflare, prefer Cloudflare for consolidation, no significant advantage over Cloudflare Pages

4. **Use Next.js instead of Astro**
   - Pros: More popular, larger ecosystem, React-based, owner may be familiar with it
   - Cons: Overkill for content site, larger bundle sizes, more complex than needed, requires React knowledge

5. **Use Hugo instead of Astro**
   - Pros: Extremely fast builds, simple, mature, good for large sites
   - Cons: Go templates less familiar than JSX/components, less modern DX, limited flexibility for future interactive features

### Rationale

**Astro selected because:**
- Content-focused architecture perfect for marketing/informational sites
- Zero JavaScript by default = fastest performance
- Component-based with familiar HTML/CSS/JS approach
- Excellent SEO out of the box
- Modern developer experience
- Can add React/Vue/Svelte components if needed later
- Strong documentation and community

**Cloudflare Pages selected because:**
- Completely free hosting (unlimited bandwidth)
- User already uses Cloudflare
- Global CDN with excellent performance
- Automatic HTTPS and SSL
- Git-based deployments (automated CI/CD)
- Integrated with Cloudflare's other services
- Simple configuration
- Excellent reliability

**Static site approach selected because:**
- Non-profit site is primarily informational
- No need for CMS (technical owner comfortable with Git/Markdown)
- Best possible performance (pre-built HTML)
- Lowest security risk (no server, no database)
- Zero hosting costs
- Easy to migrate in future (content in markdown)

### Consequences

**Positive:**
- **Cost savings:** $192-288/year reduced to ~$12-132/year (85-95% reduction)
- **Performance:** 50-90% faster page loads (static + CDN vs Squarespace)
- **SEO:** Better Core Web Vitals, faster indexing, maintained URL structure
- **Control:** Full ownership of code and content
- **Portability:** Content in markdown, easily exported/migrated
- **Security:** No server vulnerabilities, no database to hack
- **Scalability:** Can handle traffic spikes at no additional cost

**Negative:**
- **Migration effort:** 5-7 weeks of development work
- **Learning curve:** Astro/Git workflow different from Squarespace
- **No visual editor:** Must edit markdown files directly (acceptable for technical user)
- **Forms complexity:** Need third-party service if complex forms needed later (not required now)
- **Content updates:** Requires Git push + build (1-2 minutes vs instant on Squarespace)

**Trade-offs Accepted:**
- Immediate convenience (Squarespace GUI) traded for long-term cost savings and control
- Visual content editing traded for version control and portability
- Managed hosting traded for manual deployment (but automated via Git)

---

## 2025-10-06: URL Structure Preservation

**ID:** DEC-002
**Status:** Accepted
**Category:** Technical
**Stakeholders:** Phil Getzen, Development Team

### Decision

Maintain exact URL structure from Squarespace site to preserve SEO value and prevent broken external links.

### Context

Current Squarespace URLs:
- Homepage: https://www.gique.me/
- About: https://www.gique.me/about-us
- Programs: https://www.gique.me/science-can-dance, /after-school-programs, etc.
- Interviews: https://www.gique.me/interviews (with sub-pages)
- Press: https://www.gique.me/press
- Contact: https://www.gique.me/contact
- Social: https://www.gique.me/social

The site has been live since at least 2013, meaning there are likely many external backlinks pointing to these URLs. Breaking these would harm SEO and user experience.

### Rationale

- Preserving URLs prevents 404 errors for users and search engines
- Maintains link equity from backlinks
- Avoids need for complex redirect rules
- Simplifies migration and testing
- Best practice for any platform migration

### Implementation

Astro file structure will mirror URL structure:
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
│   ├── index.astro          → /interviews
│   └── [slug].astro         → /interviews/*
├── press.astro              → /press
├── contact.astro            → /contact
└── social.astro             → /social
```

### Consequences

**Positive:**
- Zero SEO loss due to URL changes
- No broken external links
- Simplified migration testing
- No need for redirect management

**Negative:**
- Must follow existing URL conventions (e.g., "press" instead of "in-the-news")
- Cannot reorganize site structure during migration

---

## 2025-10-06: Simplified Contact Approach

**ID:** DEC-003
**Status:** Accepted
**Category:** Product
**Stakeholders:** Phil Getzen

### Decision

Use simple email links (mailto:) for contact instead of web forms.

### Context

Contact forms require:
- Backend processing or third-party service
- Spam protection mechanisms
- Form state management
- Validation logic
- Additional cost (free tier limits)

For a small non-profit receiving moderate contact volume, email links provide the simplest solution.

### Alternatives Considered

1. **Formspree / Web3Forms**
   - Pros: Free tier available, spam protection, no backend needed
   - Cons: External dependency, free tier limits, unnecessary complexity for current needs

2. **Cloudflare Workers + Email Routing**
   - Pros: More control, integrated with hosting
   - Cons: Requires custom code, more complex to maintain

3. **Google Forms embed**
   - Pros: Free, familiar, spam protection
   - Cons: Poor UX, requires Google account, not on-brand

### Rationale

- Simplicity: Zero dependencies, zero cost, zero maintenance
- Direct communication: Users email directly, no intermediary
- Familiar UX: Everyone understands email links
- Privacy: No form submission tracking
- Can always add form service later if needed

### Consequences

**Positive:**
- No form service costs
- No spam management needed
- Simplest possible implementation
- No GDPR/privacy concerns with form data

**Negative:**
- Requires users to have email client configured
- No form submission tracking/analytics
- Cannot implement custom form validation
- Mobile users may have less seamless experience

**Mitigation:**
- Display email address visibly so users can copy if needed
- Can add form service in future if contact volume warrants it

---

## 2025-10-06: No CMS Implementation

**ID:** DEC-004
**Status:** Accepted
**Category:** Technical
**Stakeholders:** Phil Getzen

### Decision

Use Git + Markdown files for content management without a separate CMS interface.

### Context

Owner has "good technical skill" and is comfortable with modern development workflows. Content updates are likely infrequent for this established non-profit website.

### Alternatives Considered

1. **Sanity CMS**
   - Pros: User-friendly interface, free tier, good Astro integration
   - Cons: Additional complexity, external dependency, learning curve

2. **Strapi**
   - Pros: Open source, self-hosted option, flexible
   - Cons: Requires hosting for admin panel, overkill for simple site

3. **Decap CMS (formerly Netlify CMS)**
   - Pros: Git-based, simple interface, open source
   - Cons: Additional build complexity, maintenance burden

4. **Contentful**
   - Pros: Robust, mature, good DX
   - Cons: Free tier limits, expensive at scale, unnecessary complexity

### Rationale

- Technical user comfortable with Git workflow
- Content updates likely infrequent
- Simplicity > features for this use case
- Version control benefits (history, rollback, branches)
- Zero additional dependencies or costs
- Markdown files are portable and future-proof
- Can add CMS later if needs change (e.g., multiple non-technical editors)

### Implementation

Content workflow:
1. Edit markdown files locally or on GitHub web interface
2. Commit and push to repository
3. Cloudflare Pages auto-builds and deploys (1-2 minutes)
4. Changes live on site

### Consequences

**Positive:**
- Zero CMS costs
- No CMS maintenance or updates
- Full version control for content
- Content is portable (plain markdown)
- Simple, predictable workflow
- Can edit from any device with Git/text editor

**Negative:**
- No visual preview while editing
- Requires Git knowledge (acceptable for technical user)
- 1-2 minute deploy time vs instant updates
- Cannot grant content access without Git access
- No rich media management interface

**Future Consideration:**
- Can add Sanity or similar CMS if multiple non-technical users need content access
- Can implement GitHub Actions for preview deployments
