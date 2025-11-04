# PETSTAR WEBSITE DEVELOPMENT GUIDE

## ESSENTIAL RULES

### Template-First Approach
**NEVER write custom CSS or JavaScript.** The Solvior template contains all animations, interactive elements, and responsive layouts. Use template code as-is.

### Dynamic Loading Pattern
Sections are loaded via jQuery. Template's `main.js` runs BEFORE sections exist, so animations must be initialized in callbacks:

```javascript
$('#hero-placeholder').load('sections/section-02-hero.html', function() {
    // Initialize animations AFTER section loads
    gsap.to('.heroStack', { /* animation config */ });
    ScrollTrigger.refresh(); // Always call this
});
```

### Key Template Patterns
1. **Wrappers control effects** - Never remove: `heroStack`, `footerStack`, `service-stack`, `with-shape`
2. **Curved edges** - Template puts curves on NEXT section's TOP (use `with-shape` class)
3. **CSS custom properties** - Can be animated by GSAP (e.g., `--br-bottom-left`)
4. **Service-stack** - Auto-handled by template's `main.js` line 1424
5. **Always refresh** - Call `ScrollTrigger.refresh()` after loading sections

---

## PROJECT STRUCTURE

```
petstar-website/
├── index.html                    # Main page (loads sections)
├── sections/                     # Section HTML files
│   ├── section-01-header.html
│   ├── section-02-hero.html
│   ├── section-03-story.html
│   └── [more...]
├── assets/
│   ├── css/
│   │   ├── main.css              # Template CSS (DO NOT EDIT)
│   │   └── petstar.css           # Colors only
│   └── js/
│       ├── main.js               # Template JS (DO NOT EDIT)
│       └── petstar.js            # Empty
```

---

## HOMEPAGE SECTIONS (Variant 1)

### Complete Section List

---
---

## ⚠️ CRITICAL DEVELOPMENT RULES ⚠️

### 🎯 CORE PRINCIPLES

#### **1. Use Template's Production Code**
- ✅ **ALWAYS** copy HTML structure directly from `/solvior-html-theme/Template/`
- ✅ **ALWAYS** use template's native CSS classes and components
- ✅ **ALWAYS** rely on template's JavaScript (`main.js`) for functionality
- ❌ **NEVER** write custom CSS/JS unless explicitly necessary

#### **2. Dynamic Content Loading Pattern**
The site uses jQuery `.load()` to inject section HTML dynamically:
```javascript
$('#section-id').load('sections/section-XX.html', function() {
   // Callback runs AFTER DOM is loaded
   // Initialize animations here if needed
});
```

**Critical Understanding:**
- Template's `main.js` runs on page load, but section DOM doesn't exist yet
- Sections are loaded asynchronously via jQuery
- Animations/ScrollTriggers must be initialized in the `.load()` callback
- **ALWAYS** wait for DOM before running GSAP/ScrollTrigger code

#### **3. Animation Initialization Timing**
```javascript
// ❌ WRONG - runs before DOM exists
$('#section').load('sections/file.html');
// main.js already ran, can't find .my-element

// ✅ CORRECT - runs after DOM is loaded
$('#section').load('sections/file.html', function() {
   if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const element = document.querySelector(".my-element");
      if (element) {
         // Initialize animation here
         gsap.to(element, { /* animation */ });
      }
      ScrollTrigger.refresh(); // Recalculate positions
   }
});
```

### 🚫 DO NOT WRITE CUSTOM CODE

#### **CSS Rules:**
- ❌ **DO NOT** add custom CSS styles to `petstar.css`
- ❌ **DO NOT** override template styles
- ❌ **DO NOT** create custom animations, layouts, or components
- ✅ **ONLY** modify CSS color variables in `petstar.css`:
  ```css
  :root {
    --tj-color-theme-primary: #0075ff;      /* PetStar primary color */
    --tj-color-theme-secondary: #051229;    /* PetStar secondary color */
    --tj-color-accent: #00c853;              /* PetStar accent color */
  }
  ```
- ✅ All styling is handled by `assets/css/main.css` from the template

#### **JavaScript Rules:**
- ❌ **DO NOT** write custom JavaScript in `petstar.js`
- ❌ **DO NOT** duplicate functionality from `main.js`
- ❌ **DO NOT** add menu handlers, animations, or UI interactions
- ✅ `assets/js/main.js` handles ALL functionality:
  - Menu dropdowns and navigation
  - Mobile hamburger menu
  - Sticky header behavior
  - Animations (GSAP, WOW.js)
  - Preloader
  - Custom cursor
  - Back to top button
  - Form interactions
- ✅ Keep `petstar.js` minimal - only add code when explicitly requested
- ✅ **ALWAYS** use template's existing animation code, just initialize it after DOM loads

#### **HTML Rules:**
- ✅ **USE** template's native class names exactly:
  - `has-dropdown` (NOT `has-submenu`)
  - `sub-menu` (NOT `submenu`)
  - `href="javascript:void(0)"` for dropdown parent links
- ✅ Follow template's HTML structure precisely
- ✅ Copy from Solvior template examples when building sections
- ✅ Match template's wrapper structure (e.g., `heroStack`, `footerStack`)

### 📋 Key Learnings:

1. **Template Structure Matters**: Some effects require specific wrappers (e.g., `heroStack` for fade, curved edges on next section)

2. **Curved Bottom Implementation**: 
   - Template puts curved edge on the NEXT section's top (`.with-shape` class)
   - Not on current section's bottom
   - Example: Hero doesn't have curve, Feature section has curved top

3. **Border Radius Animation**:
   - Uses CSS custom properties: `--br-bottom-left`
   - Animated via GSAP: `gsap.to(".tj-about-section", { "--br-bottom-left": "410px" })`
   - Applied via `::before` pseudo-element in CSS

4. **Service Card Stacking**:
   - Elements with `.service-stack` class automatically stack on scroll
   - Template's `main.js` handles this at line 1424
   - Must reinitialize after dynamic loading in callback

5. **ScrollTrigger Refresh**:
   - Always call `ScrollTrigger.refresh()` after loading new content
   - Recalculates trigger positions for all animations

### 📋 Summary:
**The Solvior template is complete and production-ready. Use it as-is. Only customize colors and content. Initialize animations AFTER DOM loads.**

---
---

## 1. PROJECT OVERVIEW

**Project:** PetStar Corporate Website
**Company:** Romania's largest PET preform manufacturer (market leader since 2009)
**Template:** Solvior HTML Theme - Homepage Variant 1
**Theme Location:** `/home/octavdragoi/code/solvior-html-theme/Template/`
**Status:** Clean slate, ready for fresh implementation

### Company Profile
- **Industry:** PET Preform Manufacturing for beverage packaging
- **Position:** Largest producer in Romania & Balkans
- **Investment:** €9.5M in modern manufacturing
- **Technology:** 100% Husky equipment, SAP-integrated
- **Location:** Slobozia, Ialomița, Romania
- **Current Site:** https://www.petstar.ro/ (bilingual RO/EN)

### Technology Stack
- **HTML5** - Semantic markup
- **Bootstrap 5** - Responsive grid system
- **SCSS/CSS** - Modular styles (compiled to CSS)
- **JavaScript:** jQuery 3.x, GSAP 3.x, Swiper.js, WOW.js, Lenis
- **Icons:** Solvior custom icons + Font Awesome Pro
- **Static HTML** with includes strategy for reusability

---

## 3. TECHNICAL ARCHITECTURE

### Recommended Directory Structure
```

petstar-website/
├── sections/
│   ├── section-01-header.html
│   ├── section-02-hero.html
│   ├── section-03-story.html
│   ... (12 total section files)
├── index.html                 # Homepage (Variant 1)
├── about.html                 # Company info
├── products.html              # Product catalog
├── services.html              # Services page
├── partners.html              # Client showcase
├── news.html                  # News/blog
├── contact.html               # Contact page
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── font-awesome-pro.min.css
│   │   ├── animate.css
│   │   ├── solvior-icons.css
│   │   ├── swiper.min.css
│   │   ├── main.css          # Solvior base theme
│   │   └── petstar.css       # Custom PetStar overrides
│   ├── js/
│   │   ├── [vendor libraries]
│   │   ├── main.js           # Solvior functionality
│   │   └── petstar.js        # Custom scripts
│   ├── images/
│   │   ├── logo/
│   │   ├── hero/
│   │   ├── products/
│   │   ├── partners/
│   │   └── icons/
│   ├── fonts/
│   └── mail/
├── includes/                  # For server-side includes
│   ├── header.html
│   └── footer.html
└── CLAUDE.md                  # This file
```

### CSS Architecture (Solvior Theme)
**Main File:** `assets/css/main.css` (33,857 lines - compiled from SCSS)

**SCSS Source:** `assets/sass/`
```
sass/
├── components/           # Reusable UI components
│   ├── _buttons.scss
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _preloader.scss
│   └── [more...]
├── layout/              # Page sections
│   ├── _hero.scss
│   ├── _about.scss
│   ├── _service.scss
│   └── [more...]
└── utilities/           # Variables, mixins
    ├── _root.scss       # CSS custom properties
    ├── _colors.scss
    └── _typography.scss
```

### CSS Custom Properties
```css
:root {
  /* Typography */
  --tj-ff-body: 'Lato', sans-serif;
  --tj-ff-heading: 'Libre Franklin', serif;
  --tj-fs-body: 16px;
  --tj-fs-h1: 72px;
  --tj-fs-h2: 48px;

  /* Colors - CUSTOMIZE FOR PETSTAR */
  --tj-color-theme-primary: #0075ff;
  --tj-color-heading-primary: #051229;
  --tj-color-text-body: #364052;

  /* Font Weights */
  --tj-fw-regular: 400;
  --tj-fw-medium: 500;
  --tj-fw-bold: 700;
}
```

### Responsive Breakpoints
```scss
$xs: max-width: 575px
$sm: 576px - 767px
$md: 768px - 991px
$lg: 992px - 1199px
$xl: 1200px - 1399px
$xxl: 1400px+
```

---

## 4. DESIGN SYSTEM

### Color Palette (TO CUSTOMIZE)
```
Primary Blue: #0075ff     → Replace with PetStar brand color
Dark Navy: #051229        → Keep or adjust
Body Text: #364052        → Keep for readability
Background: #f7f7f7       → Keep
```

### Typography
- **Body Font:** Lato (300, 400, 700, 900)
- **Heading Font:** Libre Franklin (100-900)
- **Body Size:** 16px
- **Line Heights:** 1.6 (body), 1.2 (headings)

### Spacing Scale (Bootstrap)
- 0: 0
- 1: 4px
- 2: 8px
- 3: 16px
- 4: 24px
- 5: 48px

**Section Padding:** 100px top/bottom (desktop), 80px (tablet), 60px (mobile)

---

## 6. HOMEPAGE VARIANT 1 - COMPLETE STRUCTURE
1. **Header** - Navigation, logo, language switcher
2. **Hero** - Main headline, CTA, background image/video
3. **Story** - Circular economy narrative with process visualization
4. **Teams** - Two business units (Preforms + Recycling)
5. **Products** - Three categories (Preforms, rPET, Flakes)
6. **Accreditations** - Certifications and compliance badges
7. **Portfolio** - Client logos and partnerships
8. **Virtual Tour** - Facility image galleries (tabbed)
9. **Statistics** - Impact numbers with counters
10. **News** - Latest articles/updates
11. **Contact CTA** - Call-to-action section
12. **Footer** - Company info, links, newsletter

### Solvior Template Reference

| PetStar Section | Solvior Component | Template Location |
|-----------------|-------------------|-------------------|
| Header | Header-1 | Line 147 |
| Hero | Hero section | Line 1202 |
| Story | About section | Line 1618 |
| Teams | Service cards | Line 1696 |
| Products | Service grid | Line 1696 |
| Accreditations | Feature grid | Line 1267 |
| Portfolio | Brand slider | Line 2359 |
| Statistics | Counter section | Line 1841 |
| News | Blog section | Line 2181 |
| Footer | Footer-1 | Line 2355 |

---

## DEVELOPMENT WORKFLOW

### Implementation Steps

1. **Find Section in Solvior Template**
   ```bash
   # Example: Open index.html from template
   code /home/octavdragoi/code/solvior-html-theme/Template/index.html
   # Navigate to line reference (e.g., Line 1202 for hero)
   ```

2. **Copy HTML Structure**
   - Copy ONLY the section content (not <head> or scripts)
   - Keep all wrapper elements (`heroStack`, etc.)
   - Keep all class names exactly as-is

3. **Create Section File**
   ```bash
   # Example for hero section
   touch /home/octavdragoi/code/petstar-website/sections/section-02-hero.html
   ```

4. **Customize Content**
   - Replace text with PetStar content
   - Update image paths
   - Modify links/CTAs
   - **DO NOT** change HTML structure or classes

5. **Load in index.html**
   ```javascript
   $('#hero-placeholder').load('sections/section-02-hero.html', function() {
       // Initialize animations if needed
       ScrollTrigger.refresh();
   });
   ```

6. **Test Thoroughly**
   - Open in browser
   - Check responsive design
   - Verify animations work
   - Test all interactive elements

---

## ANIMATIONS QUICK REFERENCE

### GSAP ScrollTrigger
```javascript
gsap.to('.heroStack', {
    scrollTrigger: {
        trigger: '.heroStack',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    opacity: 0,
    scale: 0.95
});
```

### WOW.js Classes
```html
<div class="wow fadeInUp" data-wow-delay="0.1s">Content</div>
<div class="wow fadeInLeft" data-wow-delay="0.2s">Content</div>
<div class="wow fadeInRight" data-wow-delay="0.3s">Content</div>
```

### Odometer Counters
```html
<span class="odometer" data-count="100">0</span>
```

---

## CSS CUSTOMIZATION (MINIMAL ONLY)

Only modify colors/fonts in `petstar.css`:

```css
:root {
    --tj-color-theme-primary: #0075ff;     /* PetStar blue */
    --tj-color-theme-secondary: #051229;   /* Dark navy */
    --tj-color-theme-accent: #ff6b35;      /* Accent color */
}
```

**DO NOT** add layout styles, animations, or component styles.

---

## COMMON CLASSES

### Layout
- `.container` - Max-width container (1320px)
- `.row` - Flexbox row
- `.col-xl-6` - 6-column grid item

### Typography
- `.sec-title` - Section title
- `.sub-title` - Section subtitle
- `.text-anim` - GSAP text animation

### Components
- `.tj-primary-btn` - Primary button
- `.service-item` - Service card
- `.feature-item` - Feature box
- `.counter-item` - Counter/stat

### Template Wrappers
- `.heroStack` - Hero wrapper (fade effect)
- `.stackOverlay` - Hero overlay
- `.footerStack` - Footer wrapper
- `.service-stack` - Service card for stacking
- `.with-shape` - Curved top edge

---

## RESOURCES

- **Solvior Template:** `/home/octavdragoi/code/solvior-html-theme/Template/`
- **Bootstrap 5 Docs:** https://getbootstrap.com/docs/5.3/
- **GSAP Docs:** https://greensock.com/docs/
- **Swiper Docs:** https://swiperjs.com/

