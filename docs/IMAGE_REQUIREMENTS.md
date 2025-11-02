# Image Requirements for Petstar Website

This document outlines all images needed for the website based on the current `index.html` structure and best practices from the Solvior template.

---

## 📋 Required Images Overview

Your `index.html` currently requires **6 images**:

| # | File Path | Purpose | Priority | Recommended Size |
|---|-----------|---------|----------|------------------|
| 1 | `assets/images/favicon.png` | Browser tab icon | HIGH | 32x32px (PNG) |
| 2 | `assets/images/hero/hero-image.jpg` | Main hero section | HIGH | 1200x800px (JPG/WEBP) |
| 3 | `assets/images/about/about-image.jpg` | About section | MEDIUM | 800x600px (JPG/WEBP) |
| 4 | `assets/images/services/service-1.jpg` | Strategic Planning service | MEDIUM | 600x400px (JPG/WEBP) |
| 5 | `assets/images/services/service-2.jpg` | Leadership Coaching service | MEDIUM | 600x400px (JPG/WEBP) |
| 6 | `assets/images/services/service-3.jpg` | Business Transformation service | MEDIUM | 600x400px (JPG/WEBP) |

---

## 🎯 Detailed Specifications

### 1. Favicon (`assets/images/favicon.png`)

**Purpose:** Appears in browser tabs, bookmarks, and mobile home screens

**Specifications:**
- **Format:** PNG with transparency
- **Sizes needed:**
  - 32x32px (basic favicon)
  - 180x180px (Apple touch icon)
  - 192x192px (Android)
  - 512x512px (high-res displays)
- **Design:** Simple, recognizable icon or company logo
- **Color:** Use brand colors, should work on dark and light backgrounds

**Where to get:**
- Convert your logo using: https://realfavicongenerator.net/
- Free icon generators: https://favicon.io/
- Design tools: Figma, Adobe Illustrator, Canva

**Example from template:** Simple geometric logo or brand mark

---

### 2. Hero Image (`assets/images/hero/hero-image.jpg`)

**Purpose:** Main visual on homepage that captures attention immediately

**Specifications:**
- **Format:** JPG or WEBP (WEBP preferred for better compression)
- **Dimensions:** 1200×800px minimum (1920×1080px for high-res displays)
- **Aspect Ratio:** 3:2 or 16:9
- **File Size:** Under 300KB (optimized)
- **Subject:** Business/consulting theme

**Content Suggestions:**
- Modern office environment
- Business meeting or collaboration
- Professional consultant with clients
- Abstract geometric/modern design
- Team working on strategy

**Stock Photo Sources:**
- **Unsplash:** https://unsplash.com/s/photos/business-consulting
- **Pexels:** https://www.pexels.com/search/business/
- **Pixabay:** https://pixabay.com/images/search/consulting/
- **Freepik:** https://www.freepik.com/free-photos-vectors/business

**Example keywords:** "business consulting", "modern office", "professional team", "strategy meeting"

**From template:** They use professional photography with business professionals in modern settings

---

### 3. About Image (`assets/images/about/about-image.jpg`)

**Purpose:** Visual representation of your company/team in About section

**Specifications:**
- **Format:** JPG or WEBP
- **Dimensions:** 800×600px minimum (1200×900px preferred)
- **Aspect Ratio:** 4:3
- **File Size:** Under 200KB
- **Subject:** Team, office, or service representation

**Content Suggestions:**
- Company team photo
- Office workspace
- Service delivery in action
- Professional handshake or collaboration
- Modern workspace environment

**Stock Photo Sources:** Same as hero section

**Example keywords:** "business team", "office collaboration", "professional workplace", "consulting team"

**From template:** Professional team photos or modern office environments with people

---

### 4-6. Service Card Images (`assets/images/services/service-*.jpg`)

**Purpose:** Visual representation of each service offering

**Specifications (all 3 images):**
- **Format:** JPG or WEBP
- **Dimensions:** 600×400px minimum (900×600px preferred)
- **Aspect Ratio:** 3:2 (consistent across all three)
- **File Size:** Under 150KB each
- **Style:** Consistent look and feel across all three

#### Service 1: Strategic Planning (`service-1.jpg`)

**Content Suggestions:**
- Strategy board/whiteboard with diagrams
- Business charts and planning documents
- Team planning session
- Strategic roadmap visualization

**Keywords:** "business strategy", "planning", "roadmap", "strategic thinking"

#### Service 2: Leadership Coaching (`service-2.jpg`)

**Content Suggestions:**
- One-on-one coaching session
- Professional mentor/mentee interaction
- Leadership training
- Executive coaching

**Keywords:** "leadership coaching", "mentoring", "executive training", "professional development"

#### Service 3: Business Transformation (`service-3.jpg`)

**Content Suggestions:**
- Digital transformation concept
- Business growth visualization
- Innovation/technology integration
- Change management imagery

**Keywords:** "business transformation", "digital innovation", "growth", "change management"

---

## 🎨 Image Style Guidelines

To maintain consistency across your website:

### Color Palette
- **Primary Blue:** #0075ff
- **Dark:** #051229
- **Light:** #ffffff
- Ensure images complement these brand colors

### Visual Style
- **Modern and professional**
- **High quality** (sharp, well-lit)
- **Consistent mood** (all bright/optimistic OR all serious/corporate)
- **People-focused** where appropriate (shows human element)
- **Avoid clichés** (no generic handshakes on blue backgrounds)

### Technical Requirements
- **Brightness:** Well-lit, not too dark
- **Contrast:** Good contrast for text overlay (if needed)
- **Resolution:** High enough for retina displays (2x the display size)
- **Compression:** Optimized for web (use TinyPNG, ImageOptim)

---

## 🔧 Image Optimization Tools

Before adding images to your site, optimize them:

### Online Tools
1. **TinyPNG** - https://tinypng.com/ (PNG & JPG compression)
2. **Squoosh** - https://squoosh.app/ (WEBP conversion & optimization)
3. **ImageOptim** - https://imageoptim.com/ (Mac app)
4. **JPEG Optimizer** - http://jpeg-optimizer.com/

### Command Line (if available)
```bash
# Convert to WEBP
cwebp hero-image.jpg -q 80 -o hero-image.webp

# Optimize JPG
jpegoptim --max=85 service-1.jpg

# Optimize PNG
optipng -o7 favicon.png
```

---

## 📦 Free Stock Photo Resources

### Recommended Sources (Free, No Attribution Required)

1. **Unsplash** - https://unsplash.com/
   - High-quality professional photos
   - No attribution required
   - Large selection of business imagery

2. **Pexels** - https://www.pexels.com/
   - Curated stock photos
   - Free for commercial use
   - Great search functionality

3. **Pixabay** - https://pixabay.com/
   - Large library
   - Free for commercial use
   - Mix of photos and illustrations

4. **StockSnap** - https://stocksnap.io/
   - High-resolution photos
   - Completely free
   - New photos added weekly

5. **Burst by Shopify** - https://burst.shopify.com/
   - Business-focused photography
   - Free high-resolution images
   - Download different sizes

### Premium Sources (Paid, Higher Quality)

1. **Adobe Stock** - https://stock.adobe.com/
2. **Shutterstock** - https://www.shutterstock.com/
3. **iStock** - https://www.istockphoto.com/
4. **Getty Images** - https://www.gettyimages.com/

---

## 🚀 Quick Start Guide

### Option 1: Download from Stock Sites

1. Visit Unsplash or Pexels
2. Search for relevant keywords (see above)
3. Download high-resolution versions
4. Optimize using TinyPNG or Squoosh
5. Place in correct directories
6. Rename to match requirements

### Option 2: Use Placeholder Services (Temporary)

For development/testing, use placeholder images:

```html
<!-- Placeholder services -->
https://placehold.co/1200x800/0075ff/FFF?text=Hero+Image
https://placehold.co/800x600/051229/FFF?text=About+Image
https://placehold.co/600x400/0075ff/FFF?text=Service+1
```

**Note:** Replace with real images before launch!

### Option 3: Generate with AI (Modern Approach)

Use AI image generators:
1. **DALL-E** - https://openai.com/dall-e-2/
2. **Midjourney** - https://www.midjourney.com/
3. **Stable Diffusion** - https://stablediffusionweb.com/

**Example prompts:**
- "Professional business consulting team in modern office, bright lighting, corporate style"
- "Strategic planning session with whiteboard, professional photography"
- "Business transformation concept, modern digital workspace"

---

## 📁 Directory Structure

After adding all images, your structure should look like:

```
assets/
└── images/
    ├── favicon.png              ✓ (32x32px, multiple sizes)
    ├── about/
    │   └── about-image.jpg      ✓ (800x600px)
    ├── hero/
    │   └── hero-image.jpg       ✓ (1200x800px)
    ├── services/
    │   ├── service-1.jpg        ✓ (600x400px - Strategic Planning)
    │   ├── service-2.jpg        ✓ (600x400px - Leadership Coaching)
    │   └── service-3.jpg        ✓ (600x400px - Business Transformation)
    ├── backgrounds/             (empty, for future use)
    ├── icons/                   (empty, SVG icons if needed)
    ├── portfolio/               (empty, for future portfolio items)
    └── shapes/                  (empty, decorative SVG shapes)
```

---

## ✅ Pre-Launch Checklist

Before deploying your site, verify:

- [ ] All 6 required images are present
- [ ] Images are optimized (file sizes under target)
- [ ] Favicon appears correctly in browser tab
- [ ] Hero image loads quickly (under 2 seconds)
- [ ] Service images are same dimensions/aspect ratio
- [ ] All images have appropriate alt text in HTML
- [ ] Images display properly on mobile devices
- [ ] WEBP versions created (optional but recommended)
- [ ] No placeholder images remain
- [ ] Images align with brand colors and style

---

## 🎯 Recommended Search Terms by Section

### Hero Section
- "business consulting hero"
- "modern office workspace"
- "professional business team"
- "corporate strategy meeting"
- "business growth concept"

### About Section
- "business team portrait"
- "office collaboration"
- "professional workplace"
- "company culture"
- "diverse business team"

### Service 1 (Strategic Planning)
- "business strategy planning"
- "strategic roadmap"
- "planning whiteboard"
- "business analytics"
- "strategic thinking"

### Service 2 (Leadership Coaching)
- "executive coaching"
- "leadership mentoring"
- "professional development"
- "business mentor"
- "coaching session"

### Service 3 (Business Transformation)
- "digital transformation"
- "business innovation"
- "change management"
- "technology integration"
- "business evolution"

---

## 📊 Performance Targets

Aim for these performance metrics:

| Image | Max File Size | Load Time | Format |
|-------|--------------|-----------|---------|
| Favicon | 10KB | Instant | PNG |
| Hero | 300KB | < 2s | WEBP/JPG |
| About | 200KB | < 1.5s | WEBP/JPG |
| Services (each) | 150KB | < 1s | WEBP/JPG |

**Total page weight goal:** Under 1MB for all images combined

---

## 🔍 Image Quality Tips

1. **Resolution:** Always start with 2x the display size
2. **Compression:** Use 80-85% quality for JPG
3. **Format:** WEBP when possible (30% smaller than JPG)
4. **Lazy Loading:** Already implemented in HTML (`loading="eager"` for hero, lazy for others)
5. **Responsive:** Consider adding srcset for different screen sizes
6. **Testing:** Test on slow 3G connection to ensure fast loading

---

## 📝 Next Steps

1. **Choose your image source** (stock photos, AI generation, or custom photography)
2. **Download/create images** based on specifications above
3. **Optimize images** using compression tools
4. **Add to correct directories** following the structure above
5. **Test the website** to ensure all images load correctly
6. **Adjust as needed** based on visual appeal and performance

---

## 💡 Pro Tips

- **Consistency is key:** Use images from the same stock photo set or photographer
- **Brand alignment:** Choose images that reflect your brand personality
- **Diversity:** Include diverse representation in people-focused images
- **Avoid text in images:** Text in images doesn't scale well on mobile
- **Future-proof:** Save original high-res versions for future redesigns
- **Backup:** Keep organized folders with all source files

---

**Last Updated:** 2025-01-02
**For Questions:** Refer to CLAUDE.md for project context

**Template Reference:** Based on Solvior theme analysis (cached-solvior/index.html)
