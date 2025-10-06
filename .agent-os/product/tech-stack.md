# Technical Stack

> Last Updated: 2025-10-06
> Version: 1.0.0

## Core Framework

**Static Site Generator:** Astro 4.0+
- Modern, content-focused framework
- Zero JavaScript by default for optimal performance
- Component-based architecture
- Built-in image optimization
- Excellent SEO capabilities

## Frontend Technologies

**JavaScript Framework:** Vanilla JavaScript / Astro components
- No React/Vue/Svelte needed for this project
- Minimal client-side JavaScript
- Progressive enhancement where needed

**CSS Framework:** Tailwind CSS 3.x
- Utility-first approach
- Small bundle size
- Easy responsive design
- Customizable design system

**UI Component Library:** n/a
- Custom components built with Astro
- No complex component library needed

## Typography & Icons

**Fonts Provider:** Google Fonts
- Free, reliable CDN
- Optimized font loading
- Wide selection

**Icon Library:** Heroicons or Lucide
- Simple, clean SVG icons
- Small file sizes
- Free and open source

## Content Management

**Content Format:** Markdown / MDX
- Easy to write and maintain
- Version controlled with Git
- Portable across platforms

**Image Management:** Astro Image Optimization
- Automatic image compression
- Responsive images
- WebP conversion
- Lazy loading

## Hosting & Deployment

**Application Hosting:** Cloudflare Pages
- Free tier (unlimited bandwidth)
- Global CDN
- Automatic HTTPS
- Git-based deployments
- Zero configuration

**Asset Hosting:** Cloudflare Pages (integrated)
- Served through same CDN
- Optimized delivery
- No separate CDN needed

**Domain Management:** Cloudflare
- DNS management
- SSL/TLS certificates
- Email routing (if needed)

## Development Tools

**Code Repository:** GitHub
- Version control
- Collaboration
- CI/CD integration with Cloudflare Pages

**Deployment Solution:** Cloudflare Pages (Git integration)
- Automatic deployments on push
- Preview deployments for PRs
- Rollback capabilities
- Build logs and monitoring

**Code Repository URL:** To be created during setup

## Contact & Forms

**Contact Method:** Email links (mailto:)
- Simple, no backend needed
- Direct email client integration
- Zero cost

**Alternative (if forms needed):** Formspree or Web3Forms
- Free tier available
- Spam protection
- Email notifications

## Analytics

**Analytics Platform:** Cloudflare Web Analytics
- Privacy-focused
- No cookies
- Free
- Integrated with hosting platform

**Alternative:** n/a (Cloudflare sufficient for non-profit needs)

## Development Environment

**Package Manager:** npm
- Standard Node.js package manager
- Fast, reliable
- Good ecosystem support

**Node.js Version:** 18.x or 20.x LTS
- Long-term support
- Compatible with Astro

**Local Development Server:** Astro Dev Server
- Hot module reloading
- Fast refresh
- Built-in

## Content Migration Tools

**WordPress XML Parser:** Custom Node.js script
- Parse Squarespace WordPress export
- Extract content, images, metadata
- Generate Markdown files

**Image Processing:** Sharp (Node.js)
- Optimize images during migration
- Resize and compress
- Format conversion

## Browser Support

**Target Browsers:**
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari/Chrome

## Performance Targets

- **Lighthouse Score:** 95+ across all metrics
- **First Contentful Paint:** < 1.0s
- **Time to Interactive:** < 2.0s
- **Total Bundle Size:** < 100KB (initial load)

## Security

**HTTPS:** Automatic (Cloudflare)
**Security Headers:** Configured via Cloudflare
**Content Security Policy:** To be configured
**No Backend:** Eliminates server-side vulnerabilities

## Cost Summary

- **Hosting:** $0/month (Cloudflare Pages free tier)
- **Domain:** ~$12/year (through Cloudflare)
- **Forms (if needed):** $0-10/month (Formspree free tier likely sufficient)
- **Analytics:** $0/month (Cloudflare Web Analytics)
- **Total:** ~$1-11/month vs $16-24/month on Squarespace
