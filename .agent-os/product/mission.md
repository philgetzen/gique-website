# Product Mission

> Last Updated: 2025-10-06
> Version: 1.0.0

## Pitch

Gique.me is a modern, high-performance static website that helps students, parents, educators, and community members learn about and engage with STEAM education programs by providing fast, accessible content delivery with zero hosting costs.

## Users

### Primary Customers

- **Students and Parents**: Families seeking quality STEAM education programs and after-school activities in the Boston area
- **Educators and Volunteers**: Teachers and community members looking to partner with or learn from Gique's educational initiatives
- **Sponsors and Supporters**: Organizations and individuals seeking to support non-profit STEAM education

### User Personas

**Sarah Martinez** (35-45 years old)
- **Role:** Parent of middle school student
- **Context:** Looking for engaging after-school STEAM programs for her child
- **Pain Points:** Limited time to research programs, needs clear information about program details and schedules, wants to see evidence of educational value
- **Goals:** Find reputable STEAM programs, understand what her child will learn, easily contact program organizers

**David Chen** (28-35 years old)
- **Role:** Middle school science teacher
- **Context:** Seeking resources and partnership opportunities for classroom STEAM activities
- **Pain Points:** Limited budget for materials, needs ready-to-use lesson plans, wants to connect with local STEAM organizations
- **Goals:** Access free STEAM resources, learn about volunteer opportunities, bring hands-on learning to students

**Community Supporter** (30-65 years old)
- **Role:** Local business owner or professional
- **Context:** Interested in supporting local education initiatives
- **Pain Points:** Unclear how to contribute, limited information about organization impact, needs transparency
- **Goals:** Understand organization mission, see program outcomes, find ways to contribute time or resources

## The Problem

### High Hosting Costs for Simple Non-Profit Websites

Many non-profits spend $200-300+ annually on Squarespace or similar platforms for simple informational websites. These platforms provide more features than needed while limiting technical control and flexibility.

**Our Solution:** Migrate to a static site hosted on Cloudflare Pages, reducing costs to near-zero while improving performance.

### Slow Load Times Affecting User Experience

Content-heavy sites on traditional CMS platforms can suffer from slow load times, especially for users with slower internet connections or accessing from mobile devices. This creates barriers to accessing educational content.

**Our Solution:** Use modern static site generation with Astro to deliver pre-built HTML pages through Cloudflare's global CDN, ensuring fast load times worldwide.

### Difficulty Maintaining and Updating Content

Traditional CMS platforms can be cumbersome for technically-savvy users who prefer version control and local development workflows. Content is locked in proprietary systems.

**Our Solution:** Git-based content management allows for version control, collaborative editing, and easy content portability.

### Loss of SEO Value During Platform Migrations

Moving between platforms often breaks URLs and loses search engine rankings built up over years, reducing organic traffic to non-profit sites.

**Our Solution:** Maintain exact URL structure during migration with proper 301 redirects to preserve SEO value.

## Differentiators

### Zero-Cost Hosting with Enterprise Performance

Unlike Squarespace ($16-24/month) or other hosting platforms, Cloudflare Pages provides unlimited bandwidth, global CDN, and automatic HTTPS completely free. This results in 85-95% cost reduction while improving performance metrics.

### Modern Static Architecture

Unlike traditional CMS platforms that render pages on-demand, our static site generation approach builds all pages at deploy time. This results in 50-90% faster load times, better SEO, and enhanced security with no database or server vulnerabilities.

### Content Portability and Version Control

Unlike proprietary CMS platforms where content is locked in, our Git-based approach ensures complete ownership and portability. Content is stored in markdown files with full version history, making it easy to collaborate, track changes, and migrate to any future platform.

## Key Features

### Core Features

- **Homepage with Mission Statement:** Clear articulation of Gique's STEAM education mission with engaging hero section
- **Program Pages:** Dedicated pages for Science Can Dance!, After-School Programs, Art & Science of Beer, Fab Festival, Art of Code, and Typography booth
- **About Us Section:** Comprehensive information about organization history, team, and impact
- **STEAM Resources Hub:** Curated collection of educational resources for students and educators

### Content Features

- **Interview Series:** Complete archive of interviews with STEAM professionals and educators
- **Press Coverage:** "In the News" section showcasing media mentions and press releases
- **Image Galleries:** Visual documentation of programs and events
- **Embedded Video Content:** YouTube integration for program videos and demonstrations

### Technical Features

- **Lightning-Fast Performance:** Sub-second page loads through static generation and global CDN
- **Mobile-Responsive Design:** Optimized viewing experience across all devices
- **SEO Optimization:** Preserved URL structure, proper meta tags, sitemap generation
- **Contact Options:** Simple email contact links replacing complex form systems
- **Social Media Integration:** Links to YouTube, Twitter, Facebook, and other social platforms
