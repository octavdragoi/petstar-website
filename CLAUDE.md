# CLAUDE.md - AI Assistant Development Guide

**Purpose:** This file helps AI assistants (like Claude) understand the project structure and assist with future development tasks efficiently.

**Last Updated:** January 2, 2025
**Project Version:** 1.0.0

---

## 🎯 Project Overview

**Type:** Static HTML website with advanced animations
**Architecture:** Multi-page capable (currently single-page)
**Tech Stack:** HTML5, CSS3, Vanilla JavaScript + GSAP/WOW.js
**Dependencies:** All via CDN (no build process)
**Purpose:** Professional business consulting website template

---

## 📁 Project Structure

```
project-root/
├── index.html                    # Main entry point (362 lines)
├── assets/
│   ├── css/                     # All styling (2,634 lines total)
│   │   ├── core.css            # Design system, base styles (444 lines)
│   │   ├── components.css      # UI components (627 lines)
│   │   ├── animations.css      # Animation definitions (500 lines)
│   │   ├── layout.css          # Section layouts (488 lines)
│   │   └── responsive.css      # Media queries (575 lines)
│   ├── js/                      # All JavaScript (1,109 lines total)
│   │   ├── animations.js       # WOW.js, GSAP, SVG (314 lines)
│   │   ├── components.js       # UI logic (399 lines)
│   │   └── main.js             # Core utilities (396 lines)
│   ├── images/                  # Image assets (organized by section)
│   │   ├── hero/
│   │   ├── shapes/
│   │   ├── icons/
│   │   ├── services/
│   │   ├── portfolio/
│   │   └── backgrounds/
│   ├── svg/icons/               # SVG icon files
│   └── fonts/                   # Self-hosted fonts
│       ├── LibreFranklin/
│       └── Lato/
├── includes/                     # Optional HTML partials
├── cached-solvior/              # Reference implementation
│   ├── index.html              # Original Solvior HTML
│   └── ANIMATION_ANALYSIS.md   # Animation system docs
├── README.md                     # User documentation
├── IMPLEMENTATION_PLAN.md        # 48-step implementation guide
├── PROJECT_SUMMARY.md            # Complete project overview
├── CLAUDE.md                     # This file
└── .gitignore                    # Git ignore rules
```

---

## 🎨 Design System

### CSS Custom Properties (Root Variables)

**Location:** `assets/css/core.css` (lines 14-54)

```css
:root {
    /* Colors */
    --color-primary: #0075ff;
    --color-primary-dark: #0056cc;
    --color-primary-light: #3390ff;
    --color-dark: #051229;
    --color-light: #ffffff;
    --color-gray: #6c757d;
    --color-gray-light: #f8f9fa;

    /* Typography */
    --font-heading: 'Libre Franklin', sans-serif;
    --font-body: 'Lato', sans-serif;
    --font-size-base: 16px;
    --font-size-sm: 14px;
    --font-size-lg: 18px;
    --font-size-xl: 24px;
    --font-size-2xl: 32px;
    --font-size-3xl: 48px;
    --font-size-4xl: 64px;

    /* Spacing */
    --spacing-xs: 0.5rem;    /* 8px */
    --spacing-sm: 1rem;      /* 16px */
    --spacing-md: 1.5rem;    /* 24px */
    --spacing-lg: 2.5rem;    /* 40px */
    --spacing-xl: 4rem;      /* 64px */
    --spacing-2xl: 6rem;     /* 96px */
    --spacing-3xl: 8rem;     /* 128px */

    /* Transitions */
    --transition-fast: 0.15s;
    --transition-base: 0.3s;
    --transition-slow: 0.6s;
    --easing: ease-in-out;
}
```

### Responsive Breakpoints

| Breakpoint | Size | Target Device |
|------------|------|---------------|
| Mobile | 320px - 767px | Phones |
| Tablet | 768px - 1023px | Tablets, small laptops |
| Desktop | 1024px - 1399px | Laptops, desktops |
| Large | 1400px+ | Large desktops, 4K |

**Implementation:** Mobile-first approach using `min-width` media queries

---

## 🎬 Animation System

### Libraries Used

1. **GSAP 3.12.5** - Core animation engine
   - ScrollTrigger plugin for scroll-based animations
   - SplitText plugin ready (requires paid license)

2. **WOW.js 1.1.2** - Scroll reveal animations
   - Works with Animate.css classes
   - Configuration in `assets/js/animations.js`

3. **Animate.css 4.1.1** - CSS animation library
   - Classes: fadeInUp, fadeInLeft, fadeInRight, etc.

4. **Custom SVG Animations** - Stroke-dasharray technique
   - Defined in `assets/css/animations.css`
   - Triggered by IntersectionObserver

### Animation Classes Reference

**WOW.js Usage:**
```html
<div class="wow fadeInUp" data-wow-delay="0.2s">
    <!-- Content -->
</div>
```

**GSAP Text Animation:**
```html
<h1 class="text-anim">Animated Heading</h1>
```

**SVG Animation:**
```html
<div class="svg-animate">
    <svg><!-- SVG content --></svg>
</div>
```

**Common Animation Delays:**
- Stagger pattern: 0.1s, 0.3s, 0.5s, 0.7s
- Section delays: 0.2s, 0.4s, 0.6s

---

## 🧩 Component Architecture

### Component Naming Convention

**Pattern:** BEM-inspired (Block__Element--Modifier)

**Examples:**
- `.hero-section` → `.hero-content` → `.hero-title`
- `.feature-item` → `.feature-icon` → `.feature-title`
- `.nav-menu` → `.nav-link` → `.nav-link.active`

### Key Components

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| Buttons | components.css | 1-60 | Primary button with hover |
| Feature Cards | components.css | 70-140 | Grid cards with animations |
| Service Cards | components.css | 150-220 | Image cards with hover |
| Navigation | components.css | 280-370 | Header + mobile menu |
| Forms | components.css | 480-550 | Contact form styling |
| Footer | components.css | 580-640 | Multi-column footer |

### Adding New Components

**Steps:**
1. Add HTML to `index.html`
2. Add styles to `assets/css/components.css`
3. Add animations (optional) to `assets/css/animations.css`
4. Add JavaScript (if needed) to `assets/js/components.js`

**Template:**
```css
/* Component Block */
.component-name {
    /* Base styles */
}

.component-name__element {
    /* Element styles */
}

.component-name--modifier {
    /* Modifier styles */
}

.component-name:hover {
    /* Hover state */
}
```

---

## 📄 Section Structure

### Current Sections

1. **Hero Section** (`#home`)
   - Location: `index.html` lines 60-130
   - CSS: `layout.css` lines 10-100
   - Features: Split layout, animated text, floating shapes

2. **Features Section** (`#features`)
   - Location: `index.html` lines 135-215
   - CSS: `layout.css` lines 105-125
   - Features: 4-column grid, SVG icons

3. **About Section** (`#about`)
   - Location: `index.html` lines 220-265
   - CSS: `layout.css` lines 130-195
   - Features: 2-column, statistics counters

4. **Services Section** (`#services`)
   - Location: `index.html` lines 270-325
   - CSS: `layout.css` lines 200-220
   - Features: 3-column cards, hover effects

5. **Contact Section** (`#contact`)
   - Location: `index.html` lines 330-360
   - CSS: `layout.css` lines 225-255
   - Features: Form with validation

6. **Footer**
   - Location: `index.html` lines 365-420
   - CSS: `components.css` lines 580-640
   - Features: 4-column layout, social links

### Adding New Section Template

```html
<!-- Section HTML -->
<section id="new-section" class="new-section section">
    <div class="container">
        <!-- Section Header -->
        <div class="sec-heading">
            <span class="sub-title wow fadeInUp" data-wow-delay="0.1s">
                Subtitle Text
            </span>
            <h2 class="sec-title text-anim">Main Heading</h2>
            <div class="desc wow fadeInUp" data-wow-delay="0.3s">
                <p>Description text</p>
            </div>
        </div>

        <!-- Section Content -->
        <div class="new-section-content">
            <!-- Your content here -->
        </div>
    </div>
</section>
```

```css
/* Section CSS in layout.css */
.new-section {
    background-color: var(--color-light);
    position: relative;
}

.new-section-content {
    /* Content styles */
}
```

---

## 🔧 Common Development Tasks

### Task 1: Change Color Scheme

**File:** `assets/css/core.css` (lines 14-23)

```css
:root {
    --color-primary: #0075ff;      /* Change this */
    --color-primary-dark: #0056cc; /* And this */
    --color-primary-light: #3390ff; /* And this */
}
```

**Note:** All colors automatically update throughout the site.

---

### Task 2: Add New Page

**Steps:**
1. Create `new-page.html` (copy structure from `index.html`)
2. Update navigation links in header
3. Keep same CSS/JS includes
4. Add page-specific content

**Navigation Update:**
```html
<li><a href="new-page.html" class="nav-link">New Page</a></li>
```

---

### Task 3: Customize Animations

**Location:** `assets/js/animations.js`

**WOW.js Configuration (lines 15-25):**
```javascript
new WOW({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 0,              // Distance from viewport to trigger
    mobile: true,           // Enable on mobile
    live: true,             // Watch for new elements
    resetAnimation: false   // Don't replay on scroll up
}).init();
```

**Animation Duration:**
```css
/* In animations.css */
.animated {
    animation-duration: 0.8s;  /* Change this */
}
```

---

### Task 4: Add SVG Icon Animation

**Step 1:** Add SVG HTML
```html
<div class="feature-icon svg-animate">
    <svg width="80" height="80" viewBox="0 0 80 80">
        <path class="path-0" stroke="currentColor" d="..." />
        <path class="path-1" stroke="currentColor" d="..." />
    </svg>
</div>
```

**Step 2:** Add CSS animation (in `animations.css`)
```css
.svg-animate .path-0 {
    stroke-dasharray: 284 286;
    stroke-dashoffset: 285;
    animation: draw-path 2000ms ease-in-out 0ms forwards;
}

.svg-animate .path-1 {
    stroke-dasharray: 284 286;
    stroke-dashoffset: 285;
    animation: draw-path 2000ms ease-in-out 250ms forwards;
}
```

---

### Task 5: Add Counter Animation

```html
<div class="stat-item">
    <h3 class="stat-number odometer" data-count="250">0</h3>
    <span class="stat-label">Clients Served</span>
</div>
```

**Note:** Counter automatically animates when scrolled into view (via `animations.js`)

---

### Task 6: Add Carousel/Slider

**Step 1:** Add HTML structure
```html
<div class="swiper services-swiper">
    <div class="swiper-wrapper">
        <div class="swiper-slide"><!-- Content --></div>
        <div class="swiper-slide"><!-- Content --></div>
        <div class="swiper-slide"><!-- Content --></div>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
</div>
```

**Step 2:** Initialize in `animations.js` (lines 140-165)
- Swiper initialization code already present for `.services-swiper`
- Copy pattern for new carousels

---

### Task 7: Add Form Field

```html
<div class="form-group">
    <input
        type="text"
        class="form-control"
        name="field-name"
        placeholder="Your Placeholder"
        required
    >
</div>
```

**Note:** Form validation automatically applies to `required` fields (via `components.js`)

---

## 🐛 Debugging Guide

### Common Issues & Solutions

**Issue 1: Animations Not Playing**
- **Check:** Browser console for JavaScript errors
- **Check:** WOW.js and GSAP loaded from CDN
- **Check:** Element has correct class (`.wow`, `.text-anim`, `.svg-animate`)
- **Solution:** Ensure scripts load in order: jQuery → GSAP → WOW → Custom

**Issue 2: Mobile Menu Not Opening**
- **Check:** `.menu-toggle` and `.nav-menu` elements exist
- **Check:** JavaScript console for errors
- **Fix:** Verify `components.js` loaded correctly

**Issue 3: Responsive Layout Broken**
- **Check:** Viewport meta tag in `<head>`
- **Check:** Browser width using DevTools
- **Fix:** Test breakpoints in `responsive.css`

**Issue 4: SVG Not Animating**
- **Check:** SVG has `.svg-animate` class
- **Check:** Path elements have correct classes (`.path-0`, etc.)
- **Check:** Animation keyframes defined in `animations.css`

**Issue 5: Form Validation Not Working**
- **Check:** Form has submit event listener
- **Check:** `components.js` loaded
- **Fix:** Ensure fields have `required` attribute

---

## 📊 Performance Optimization

### Current Optimizations

✅ **Lazy Loading:** Images with `IntersectionObserver`
✅ **Hardware Acceleration:** `transform3d()` for animations
✅ **Debouncing:** Scroll/resize handlers throttled
✅ **Will-change:** Added to animated elements
✅ **Async Loading:** Scripts loaded with defer
✅ **Reduced Motion:** Respects user preferences

### Performance Checklist

Before deployment:
- [ ] Minify CSS files (`core.css`, `components.css`, etc.)
- [ ] Minify JavaScript files
- [ ] Compress images (use TinyPNG, ImageOptim)
- [ ] Convert images to WebP with fallbacks
- [ ] Run Lighthouse audit (target 90+ performance)
- [ ] Test on slow 3G connection
- [ ] Verify mobile performance

### Minification Commands

```bash
# CSS minification (example)
npx clean-css-cli assets/css/core.css -o assets/css/core.min.css

# JS minification (example)
npx terser assets/js/animations.js -o assets/js/animations.min.js
```

---

## ♿ Accessibility Checklist

Current Implementation:
- ✅ Semantic HTML5 elements
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators (`.keyboard-nav` class)
- ✅ Alt text structure ready for images
- ✅ Color contrast compliance (primary: #0075ff has 4.5:1 ratio)
- ✅ Reduced motion support

### Testing Accessibility

**Tools:**
- Lighthouse Accessibility audit
- axe DevTools browser extension
- NVDA/JAWS screen reader testing
- Keyboard-only navigation test

**Key Tests:**
1. Navigate entire site with Tab key
2. Activate all interactive elements with Enter/Space
3. Test with screen reader
4. Verify focus indicators visible
5. Check color contrast ratios

---

## 🚀 Deployment Guide

### Pre-Deployment Checklist

- [ ] Update meta tags (title, description, keywords)
- [ ] Add real content (replace placeholder text)
- [ ] Add real images to `assets/images/`
- [ ] Test all forms and validation
- [ ] Run Lighthouse audit
- [ ] Test in multiple browsers
- [ ] Test on mobile devices
- [ ] Minify CSS/JS (optional but recommended)
- [ ] Set up analytics (Google Analytics, etc.)

### Deployment Options

**Option 1: Netlify** (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Option 2: Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Option 3: GitHub Pages**
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and root folder
4. Site live at `https://username.github.io/repo`

**Option 4: Traditional Hosting**
- Upload all files via FTP/SFTP
- Ensure `index.html` is in root directory
- Maintain folder structure

---

## 🔐 Security Considerations

### Current Security Features

✅ **No Backend:** Static site = minimal attack surface
✅ **External Links:** Automatically get `rel="noopener noreferrer"`
✅ **Form Validation:** Client-side validation prevents bad input
✅ **No Inline Scripts:** All JS in external files
✅ **CSP Ready:** Can add Content Security Policy headers

### Security Enhancements (Optional)

**Add Content Security Policy:**
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```

**HTTPS Enforcement:**
- Always use HTTPS in production
- Netlify/Vercel provide free SSL certificates

---

## 📝 Code Style Guide

### HTML
- Use semantic HTML5 elements
- Indent with 4 spaces
- Use lowercase for tags and attributes
- Add comments for major sections
- Use meaningful class names

### CSS
- BEM-inspired naming convention
- Group related properties
- Use CSS custom properties for values
- Comment complex selectors
- Mobile-first media queries

### JavaScript
- Use ES6+ syntax
- IIFEs for modules
- camelCase for variables/functions
- PascalCase for classes
- Add JSDoc comments for functions

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Desktop:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Mobile:**
- [ ] iOS Safari
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet

**Responsive:**
- [ ] 320px (small mobile)
- [ ] 375px (iPhone)
- [ ] 768px (tablet portrait)
- [ ] 1024px (tablet landscape / small laptop)
- [ ] 1440px (desktop)
- [ ] 1920px (large desktop)

**Interactions:**
- [ ] All links work
- [ ] Mobile menu opens/closes
- [ ] Smooth scroll works
- [ ] Forms validate correctly
- [ ] Animations play smoothly
- [ ] Hover effects work

---

## 📞 Getting Help

### Documentation Files

1. **[README.md](README.md)** - User guide, quick start
2. **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Detailed dev guide (48 steps)
3. **[ANIMATION_ANALYSIS.md](cached-solvior/ANIMATION_ANALYSIS.md)** - Animation docs
4. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete overview
5. **[CLAUDE.md](CLAUDE.md)** - This file

### Quick References

**Change Colors:** `assets/css/core.css` lines 14-23
**Add Section:** Copy pattern from `layout.css`
**Customize Animations:** `assets/js/animations.js`
**Add Component:** `assets/css/components.css`

---

## 🎯 AI Assistant Instructions

When helping with this project:

1. **Understand Structure:** Review this file first for project context
2. **Maintain Consistency:** Follow existing patterns and naming conventions
3. **Check Dependencies:** All libraries loaded via CDN (no npm/build process)
4. **Preserve Architecture:** Keep modular CSS/JS structure
5. **Mobile-First:** Always consider responsive design
6. **Accessibility:** Maintain WCAG AA compliance
7. **Performance:** Use hardware-accelerated animations
8. **Documentation:** Update this file when adding major features

### Common AI Tasks

**"Add a new section"**
→ Use section template from this file, add to `layout.css`, update nav

**"Change colors"**
→ Edit CSS custom properties in `core.css` root

**"Fix animation"**
→ Check browser console, verify class names, test in `animations.js`

**"Make it responsive"**
→ Add media queries in `responsive.css` following mobile-first pattern

**"Optimize performance"**
→ Check images, minify files, lazy load, hardware acceleration

---

## 📋 Version History

### v1.0.0 (2025-01-02)
- Initial release
- Complete static website
- 4,105 lines of code
- Full documentation
- Production-ready

---

## 🎓 Learning Resources

### Technologies Used
- **GSAP:** https://greensock.com/docs/
- **WOW.js:** https://wowjs.uk/
- **Animate.css:** https://animate.style/
- **Bootstrap Grid:** https://getbootstrap.com/docs/5.3/layout/grid/
- **Swiper:** https://swiperjs.com/
- **Font Awesome:** https://fontawesome.com/docs

### Concepts Applied
- Mobile-first responsive design
- CSS custom properties (variables)
- IntersectionObserver API
- Event delegation
- Debouncing and throttling
- Hardware-accelerated animations
- Semantic HTML5
- WCAG accessibility

---

**For AI Assistants:** This is a production-ready static website. When modifying, maintain the established patterns, preserve the modular architecture, and update documentation accordingly. All code follows modern best practices for performance, accessibility, and maintainability.

**Last Updated:** January 2, 2025
