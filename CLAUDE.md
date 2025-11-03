# PETSTAR WEBSITE - DEVELOPMENT GUIDE

---
---

## ⚠️ CRITICAL DEVELOPMENT RULES ⚠️

### 🚫 DO NOT WRITE CUSTOM CODE UNLESS EXPLICITLY REQUESTED

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

#### **HTML Rules:**
- ✅ **USE** template's native class names exactly:
  - `has-dropdown` (NOT `has-submenu`)
  - `sub-menu` (NOT `submenu`)
  - `href="javascript:void(0)"` for dropdown parent links
- ✅ Follow template's HTML structure precisely
- ✅ Copy from Solvior template examples when building sections

### 📋 Summary:
**The Solvior template is complete and production-ready. Use it as-is. Only customize colors and content.**

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

## 2. CURRENT PROJECT STATUS

### Git Repository
- **Branch:** master
- **Last Commit:** 0c87238 - "done with v1" (all files deleted)
- **Working Directory:** Clean, ready for new implementation

### Previous Implementation (Deleted)
Previous v1 had component-based architecture with HTML includes, modular CSS, and custom animations. All deleted - starting fresh with Solvior Variant 1 as foundation.

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

## 5. COMPONENT LIBRARY

### 5.1 Required Dependencies

**CSS Files (in order):**
```html
<link rel="stylesheet" href="assets/css/bootstrap.min.css" />
<link rel="stylesheet" href="assets/css/font-awesome-pro.min.css" />
<link rel="stylesheet" href="assets/css/animate.css" />
<link rel="stylesheet" href="assets/css/solvior-icons.css" />
<link rel="stylesheet" href="assets/css/swiper.min.css" />
<link rel="stylesheet" href="assets/css/nice-select.css" />
<link rel="stylesheet" href="assets/css/venobox.min.css" />
<link rel="stylesheet" href="assets/css/meanmenu.css" />
<link rel="stylesheet" href="assets/css/main.css" />
<link rel="stylesheet" href="assets/css/petstar.css" /> <!-- Custom -->
```

**JS Files (before closing `</body>`):**
```html
<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/gsap.min.js"></script>
<script src="assets/js/gsap-scroll-trigger.min.js"></script>
<script src="assets/js/gsap-split-text.min.js"></script>
<script src="assets/js/lenis.min.js"></script>
<script src="assets/js/swiper.min.js"></script>
<script src="assets/js/nice-select.js"></script>
<script src="assets/js/meanmenu.js"></script>
<script src="assets/js/venobox.min.js"></script>
<script src="assets/js/wow.min.js"></script>
<script src="assets/js/appear.min.js"></script>
<script src="assets/js/odometer.min.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/petstar.js"></script> <!-- Custom -->
```

### 5.2 Header Component

**Location:** Solvior `index.html` line 147

```html
<header class="tj-header-area header-1 header-absolute">
   <!-- Topbar (optional) -->
   <div class="header-topbar">
      <div class="container-fluid">
         <div class="row">
            <div class="col-12">
               <div class="header-topbar_wrap">
                  <div class="topbar_note">
                     <i class="tji-check"></i> Romania's Leading PET Manufacturer
                  </div>
                  <div class="topbar_infos">
                     <div class="info_item">
                        <span><i class="tji-email"></i></span>
                        <a href="mailto:office@petstar.ro">office@petstar.ro</a>
                     </div>
                     <div class="info_item">
                        <select class="nice-select">
                           <option value="ro">Română</option>
                           <option value="en">English</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>

   <!-- Main Header -->
   <div class="header-bottom">
      <div class="container-fluid">
         <div class="row">
            <div class="col-12">
               <div class="header-wrapper">
                  <div class="site-logo">
                     <a class="logo" href="index.html">
                        <img src="assets/images/logo/petstar-logo.png" alt="PetStar">
                     </a>
                  </div>

                  <div class="mainmenu d-lg-block d-none" id="main-menu">
                     <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="products.html">Products</a></li>
                        <li><a href="services.html">Services</a></li>
                        <li><a href="partners.html">Partners</a></li>
                        <li><a href="news.html">News</a></li>
                        <li><a href="contact.html">Contact</a></li>
                     </ul>
                  </div>

                  <div class="header_right_info d-none d-md-inline-flex">
                     <a href="contact.html" class="tj-primary-btn header_btn">
                        <div class="btn_inner">
                           <div class="btn_icon">
                              <span>
                                 <i class="tji-arrow-right"></i>
                                 <i class="tji-arrow-right"></i>
                              </span>
                           </div>
                           <div class="btn_text">
                              <span>Get Quote</span>
                           </div>
                        </div>
                     </a>
                  </div>

                  <button class="menu_btn d-lg-none hamburgerBtn">
                     Menu
                     <span class="cubes">
                        <span></span><span></span><span></span><span></span>
                     </span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   </div>
</header>

<!-- Sticky Duplicate -->
<header class="tj-header-area header-1 header-duplicate header-sticky">
   <!-- Same structure as above -->
</header>
```

**SCSS File:** `assets/sass/components/_header.scss`

### 5.3 Hero Section (Variant 1)

**Location:** Solvior `index.html` line 1202

```html
<div class="heroStack">
   <div class="stackOverlay"></div>
   <section class="tj-hero-section">
      <div class="container">
         <div class="row">
            <div class="hero-wrapper">
               <div class="hero-content">
                  <h1 class="hero-title text-anim">
                     Romania's Leading
                     <span class="active-color">PET Preform</span>
                     Manufacturer
                  </h1>
                  <div class="desc wow fadeInUp" data-wow-delay="0.1s">
                     <p>Industry leader since 2009 with cutting-edge technology and €9.5M investment in manufacturing excellence.</p>
                  </div>
                  <div class="wow fadeInUp" data-wow-delay="0.3s">
                     <a href="contact.html" class="tj-primary-btn hero-button">
                        <div class="btn_inner">
                           <div class="btn_icon">
                              <span>
                                 <i class="tji-arrow-right"></i>
                                 <i class="tji-arrow-right"></i>
                              </span>
                           </div>
                           <div class="btn_text">
                              <span>Request Quote</span>
                           </div>
                        </div>
                     </a>
                  </div>
               </div>

               <div class="hero-images-box">
                  <div class="hero-images">
                     <img src="assets/images/hero/petstar-facility.webp" alt="Manufacturing">
                  </div>
               </div>
            </div>
         </div>
      </div>
   </section>
</div>
```

**Key Classes:**
- `.text-anim` - GSAP character animation
- `.wow fadeInUp` - Scroll reveal animation
- `data-wow-delay` - Animation delay

**SCSS File:** `assets/sass/layout/_hero.scss`

### 5.4 Feature Section

**Location:** Solvior `index.html` line 1267

```html
<section class="tj-feature-section">
   <div class="container">
      <div class="row">
         <div class="col-12">
            <div class="sec-heading text-center">
               <span class="sub-title wow fadeInUp">Why Choose PetStar</span>
               <h2 class="sec-title text-anim">Industry-Leading Capabilities</h2>
            </div>
         </div>
      </div>
      <div class="row">
         <div class="col-xl-3 col-lg-6 col-md-6">
            <div class="feature-item wow fadeInUp" data-wow-delay="0.1s">
               <div class="feature-icon">
                  <img src="assets/images/icons/technology.svg" alt="Technology">
               </div>
               <h4 class="title">Advanced Technology</h4>
               <div class="desc">
                  <p>100% Husky equipment with state-of-the-art manufacturing processes.</p>
               </div>
            </div>
         </div>
         <!-- Repeat for 3 more features -->
      </div>
   </div>
</section>
```

### 5.5 Service/Product Cards

```html
<div class="service-item">
   <div class="service-content">
      <div class="service-text">
         <div class="service-icons">
            <img src="assets/images/icons/preforms.svg" alt="Preforms">
         </div>
         <h3 class="title">
            <a href="products.html">PET Preforms</a>
         </h3>
         <div class="desc">
            <p>Wide range of preform sizes and specifications for beverage packaging.</p>
         </div>
         <a href="products.html" class="text-btn">
            Learn more <i class="tji-arrow-right"></i>
         </a>
      </div>
   </div>
   <div class="service-images">
      <img src="assets/images/products/preforms.webp" alt="Products">
   </div>
</div>
```

### 5.6 Counter/Statistics Section

```html
<section class="tj-counter-section">
   <div class="container">
      <div class="row">
         <div class="col-12">
            <div class="counter-wrapper">
               <div class="counter-item">
                  <div class="number">
                     <span class="odometer" data-count="16">0</span>+
                  </div>
                  <span class="sub-title">Years Excellence</span>
               </div>
               <div class="counter-item">
                  <div class="number">
                     <span class="odometer" data-count="100">0</span>M+
                  </div>
                  <span class="sub-title">Preforms Produced</span>
               </div>
               <!-- Add more counters -->
            </div>
         </div>
      </div>
   </div>
</section>
```

**Note:** Odometer animates on scroll into view (requires appear.js)

### 5.7 Footer Component

**Location:** Solvior `index.html` line 2355

```html
<footer class="tj-footer-area footer-1">
   <!-- Brand/Partners Slider -->
   <section class="tj-brand-section">
      <div class="container">
         <div class="row">
            <div class="col-12">
               <div class="swiper brand-slider-1">
                  <div class="swiper-wrapper">
                     <div class="swiper-slide">
                        <div class="brand-logo">
                           <img src="assets/images/partners/client-1.png" alt="Client">
                        </div>
                     </div>
                     <!-- More partner logos -->
                  </div>
               </div>
            </div>
         </div>
      </div>
   </section>

   <!-- Footer Widgets -->
   <div class="footer-top-area">
      <div class="container">
         <div class="row">
            <div class="col-xl-4 col-lg-4 col-md-6">
               <div class="footer-widget footer-contact-infos">
                  <div class="footer-title">
                     <h4 class="title">Contact PetStar</h4>
                  </div>
                  <div class="infos-item">
                     <span>Headquarters</span>
                     <p>DN 2A Km 64, Slobozia, Ialomița, Romania</p>
                     <a href="tel:+40243230808">+40 243 230 808</a>
                  </div>
               </div>
            </div>

            <div class="col-xl-2 col-lg-2 col-md-6">
               <div class="footer-widget widget_nav_menu">
                  <div class="footer-title">
                     <h4 class="title">Quick Links</h4>
                  </div>
                  <div class="widget-menu">
                     <ul>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="products.html">Products</a></li>
                        <li><a href="services.html">Services</a></li>
                        <li><a href="contact.html">Contact</a></li>
                     </ul>
                  </div>
               </div>
            </div>

            <div class="col-xl-3 col-lg-3 col-md-6">
               <div class="footer-widget footer-newsletter-form">
                  <div class="newsletter-title">
                     <h3 class="title">Newsletter</h3>
                  </div>
                  <div class="newsletter-form">
                     <form>
                        <div class="form-input">
                           <input type="email" name="email" placeholder="Your email" required>
                           <button class="tj-footer-input-btn">
                              <i class="fa-solid fa-paper-plane"></i>
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>

   <!-- Copyright -->
   <div class="footer-copyright-area">
      <div class="container">
         <div class="row">
            <div class="col-12">
               <div class="copyright-content-area">
                  <div class="copyright-text">
                     <p>© 2025 <a href="https://www.petstar.ro">PetStar</a>. All rights reserved.</p>
                  </div>
                  <div class="copyright-socails">
                     <ul>
                        <li><a href="#"><i class="fa-brands fa-facebook-f"></i></a></li>
                        <li><a href="#"><i class="fa-brands fa-linkedin-in"></i></a></li>
                     </ul>
                  </div>
                  <div class="copyright-menu">
                     <ul>
                        <li><a href="gdpr.html">GDPR Policy</a></li>
                        <li><a href="terms.html">Terms</a></li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>

   <!-- Back to Top -->
   <div class="back-to-top-wrapper">
      <button id="back_to_top" type="button" class="back-to-top-btn">
         <i class="tji-arrow-up"></i>
         <span>TOP</span>
      </button>
   </div>
</footer>
```

### 5.8 Button Components

**Primary Button:**
```html
<a href="contact.html" class="tj-primary-btn">
   <div class="btn_inner">
      <div class="btn_icon">
         <span>
            <i class="tji-arrow-right"></i>
            <i class="tji-arrow-right"></i>
         </span>
      </div>
      <div class="btn_text">
         <span>Button Text</span>
      </div>
   </div>
</a>
```

**Text Button:**
```html
<a href="#" class="text-btn">
   Learn more <i class="tji-arrow-right"></i>
</a>
```

**SCSS File:** `assets/sass/components/_buttons.scss`

### 5.9 Contact Form

```html
<form action="assets/mail/contact-form.php" method="POST" class="contact-form">
   <div class="row">
      <div class="col-md-6">
         <div class="form-group">
            <input type="text" name="name" placeholder="Your name" required>
         </div>
      </div>
      <div class="col-md-6">
         <div class="form-group">
            <input type="email" name="email" placeholder="Email address" required>
         </div>
      </div>
      <div class="col-12">
         <div class="form-group">
            <input type="text" name="subject" placeholder="Subject">
         </div>
      </div>
      <div class="col-12">
         <div class="form-group">
            <textarea name="message" placeholder="Your message" required></textarea>
         </div>
      </div>
      <div class="col-12">
         <button type="submit" class="tj-primary-btn">
            <div class="btn_inner">
               <div class="btn_text">
                  <span>Send Message</span>
               </div>
            </div>
         </button>
      </div>
   </div>
</form>
```

### 5.10 Mobile Hamburger Menu

**HTML Structure:** (Include after header)
```html
<div class="body-overlay"></div>
<div class="hamburger-area" data-lenis-prevent>
   <div class="hamburger_wrapper">
      <div class="hamburger_top">
         <div class="hamburger_logo">
            <a href="index.html">
               <img src="assets/images/logo/petstar-logo.png" alt="PetStar">
            </a>
         </div>
         <div class="hamburger_close">
            <button class="hamburger_close_btn hamburgerCloseBtn">
               <i class="fa-thin fa-times"></i>
            </button>
         </div>
      </div>

      <div class="hamburger_menu">
         <div class="mobile_menu"></div>
      </div>

      <div class="hamburger-infos">
         <h4 class="hamburger-title">Contact</h4>
         <div class="contact-info">
            <div class="contact_item">
               <span class="subtitle">Email</span>
               <a href="mailto:office@petstar.ro">office@petstar.ro</a>
            </div>
            <div class="contact_item">
               <span class="subtitle">Phone</span>
               <a href="tel:+40243230808">+40 243 230 808</a>
            </div>
         </div>
      </div>
   </div>
</div>
```

**SCSS File:** `assets/sass/components/_hamburger.scss`

### 5.11 Global Elements (Required)

Add before closing `</body>`:

```html
<!-- Custom Cursor -->
<div class="mouseCursor cursor-outer"></div>
<div class="mouseCursor cursor-inner"></div>

<!-- Preloader -->
<div class="preloader">
   <div class="loading-container">
      <div class="loading"></div>
      <div id="loading-icon">
         <img src="assets/images/loader.svg" alt="Loading">
      </div>
   </div>
</div>
```

---

## 6. HOMEPAGE VARIANT 1 - COMPLETE STRUCTURE

### Why Variant 1 for PetStar
- **Professional B2B layout** - Perfect for manufacturing company
- **Clear information hierarchy** - Easy to navigate
- **Feature-rich sections** - Showcases capabilities
- **Statistics/counter section** - Highlight achievements
- **Partner showcase** - Display client logos
- **Modern animations** - Professional polish
- **Mobile-responsive** - Works on all devices

### Complete Section Breakdown

**Solvior index.html has these sections (lines referenced):**

1. **Line 147** - Header with topbar
2. **Line 1202** - Hero section with image and CTA
3. **Line 1267** - Feature grid (4 columns)
4. **Line 1618** - About section with image
5. **Line 1696** - Services showcase
6. **Line 1841** - Counter/statistics
7. **Line 1918** - Testimonials slider
8. **Line 2061** - Projects/portfolio grid
9. **Line 2181** - Blog posts
10. **Line 2359** - Brand/partner logos
11. **Line 2355** - Footer with newsletter

### PetStar Homepage Plan - Circular Economy Focus

**Business Model:** PetStar operates TWO integrated businesses:
1. **PET Recycling** - Transforms PET waste into rPET materials
2. **Preform Manufacturing** - Produces bottle preforms from recycled & virgin PET

**Core Message:** Closing the circular economy loop from waste to new bottles

### Homepage Sections (In Order):

#### 1. **Header**
**Solvior Reference:** Line 147 (Header component)
- PetStar logo
- Navigation: Home | Story | Teams | Products | Accreditations | Portfolio | Virtual Tour | News | Contact
- Language switcher (RO/EN)
- CTA button: "Get Quote"

#### 2. **Hero Section**
**Solvior Reference:** Line 1202 (Hero section)
**Content:**
- **Headline:** "Closing the Circle: From PET Waste to Premium Preforms"
- **Subheadline:** "Leading Romania's circular economy with bottle-to-bottle technology"
- **CTA:** "Discover Our Story"
- **Visual:** Split image or animated graphic showing waste → recycling → preforms → bottles
- **Key Stats Overlay:**
  - "16+ Years Excellence"
  - "100% Bottle-to-Bottle"
  - "€9.5M Investment"

#### 3. **Story Section - Circular Economy Journey**
**Solvior Reference:** Line 1618 (About section) + custom timeline
**Content:**
- **Section Title:** "Our Circular Economy Story"
- **Subtitle:** "Integrated bottle-to-bottle technology closing the sustainability loop"

**Layout:** Two-column or visual flow diagram
- **Left Side:** Process visualization
  - Step 1: PET waste collection
  - Step 2: Recycling process (flakes, rPET)
  - Step 3: Preform production
  - Step 4: Bottle manufacturing (by clients)
  - Circle closes: Bottles → Waste → Collection

- **Right Side:** Story narrative
  - Company mission and vision
  - Technology focus: "Bottle-to-bottle" capability
  - Sustainability commitment
  - Market leadership position

**Visual Elements:**
- Animated circular diagram (use GSAP)
- Icons for each process step
- Photos from both facilities

#### 4. **Teams Section - Two Business Units**
**Solvior Reference:** Line 1696 (Services section) adapted
**Content:**
- **Section Title:** "Our Teams"
- **Subtitle:** "Two specialized units, one integrated mission"

**Layout:** Two large cards (50/50 split or side-by-side)

**Card 1: Preforms Team**
- Icon/image: Preform production line
- Title: "Preforms Manufacturing"
- Description: "State-of-the-art production facility creating premium PET preforms for beverage packaging using 100% Husky equipment."
- Key Stats:
  - Production capacity
  - Variety of preform sizes
  - SAP-integrated operations
- CTA Button: "Visit Preforms Team" → links to `preforms-team.html`

**Card 2: Recycling Team**
- Icon/image: Recycling facility
- Title: "PET Recycling"
- Description: "Advanced recycling facility transforming PET waste into food-grade rPET materials, certified for direct food contact."
- Key Stats:
  - Recycling capacity
  - rPET quality grades
  - Sustainability impact
- CTA Button: "Visit Recycling Team" → links to `recycling-team.html`

#### 5. **Products Section - Three Categories**
**Solvior Reference:** Line 1696 (Services section) + grid layout
**Content:**
- **Section Title:** "Our Product Portfolio"
- **Subtitle:** "From recycled materials to finished preforms"

**Layout:** Three-column grid or tabbed interface

**Column 1: PET Preforms**
- Icon/image: Various preform sizes
- Title: "PET Preforms"
- Description: "Wide range of preform specifications for beverage packaging"
- Product highlights:
  - Multiple neck finishes (PCO, BPF, etc.)
  - Various weights and sizes
  - Custom solutions available
  - Virgin & recycled content options
- CTA: "View Preforms Catalog" → links to products page with filter

**Column 2: rPET (Recycled PET)**
- Icon/image: rPET pellets/materials
- Title: "rPET Materials"
- Description: "Food-grade recycled PET for sustainable manufacturing"
- Product highlights:
  - Food-contact approved (EFSA)
  - Various grades available
  - Transparent to colored options
  - Traceable sourcing
- CTA: "View rPET Products" → links to products page with filter

**Column 3: PET Flakes**
- Icon/image: Cleaned PET flakes
- Title: "PET Flakes"
- Description: "High-quality cleaned and sorted PET flakes"
- Product highlights:
  - Clean, contamination-free
  - Color-sorted options
  - Industrial applications
  - Bulk quantities
- CTA: "View Flake Products" → links to products page with filter

#### 6. **Accreditations Section**
**Solvior Reference:** Line 1267 (Feature grid) adapted for certifications
**Content:**
- **Section Title:** "Quality & Compliance"
- **Subtitle:** "Certified excellence across both operations"

**Layout:** Grid layout with certification badges (similar to feature items)

**Three Main Groups:**

**Group 1: Preforms Certifications**
- Recyclass certification
- ISO 9001 Quality Management
- ISO 14001 Environmental
- Food contact compliance
- Custom industry certifications

**Group 2: Recycling Certifications**
- Recyclass (recycled content verification)
- EFSA (European Food Safety Authority)
- Food contact approval
- ISO certifications
- Environmental standards

**Group 3: Corporate Policies (Both)**
- SMI (Sustainability, Management, Innovation) Policy
- Corporate responsibility
- Environmental commitment
- Quality assurance

**Visual Treatment:**
- Certification logos/badges with tooltips
- Click to view full certificates (modal or PDF)
- Organized by category with clear labels
- Professional badge display

#### 7. **Portfolio Section - Client Showcase**
**Solvior Reference:** Line 2359 (Brand section) + Line 2061 (Project grid)
**Content:**
- **Section Title:** "Trusted by Industry Leaders"
- **Subtitle:** "Partnering with major brands across Europe"

**Layout Option A:** Logo carousel (Swiper slider)
- PepsiCo
- Heineken
- Ursus Breweries
- Maspex
- Avril Group
- Bunge

**Layout Option B:** Grid with case study cards
- Each client logo as a card
- Hover reveals partnership details
- Link to case study (if available)

**Additional Elements:**
- Client testimonials (if available)
- Partnership statistics
- Geographic reach map

#### 8. **Virtual Tour Section - Factory Showcase**
**Solvior Reference:** New custom section + Line 2061 (Slider adapted)
**Content:**
- **Section Title:** "Virtual Factory Tour"
- **Subtitle:** "Explore our state-of-the-art facilities"

**Layout:** Image carousel/slider (Swiper) with tabs

**Two Tabs:**

**Tab 1: Preform Facility**
- Image carousel with 8-12 photos:
  - Exterior building shot
  - Production floor overview
  - Husky injection molding machines
  - Quality control lab
  - Warehouse/logistics
  - Team in action
  - Clean room environment
  - Finished preforms
- Each image with caption

**Tab 2: Recycling Facility**
- Image carousel with 8-12 photos:
  - Facility exterior
  - Sorting line
  - Washing/cleaning process
  - Extrusion equipment
  - Quality testing
  - rPET materials
  - Storage silos
  - Logistics area

**Interactive Features:**
- Full-screen image viewer (VenoBox lightbox)
- Auto-play option
- Navigation arrows
- Thumbnail navigation
- Download facility brochure CTA

**Alternative:** 360° virtual tour integration (if available)

#### 9. **Statistics/Counter Section**
**Solvior Reference:** Line 1841 (Counter section)
**Content:**
- **Section Title:** "Our Impact in Numbers"

**Counters (4-6 items):**
- **16+** Years of Excellence
- **€9.5M** Technology Investment
- **100M+** Preforms Produced Annually
- **XX Tons** PET Recycled Yearly
- **6** Major Brand Partners
- **100%** Bottle-to-Bottle Capable

**Visual:** Animated odometer counters on scroll

#### 10. **News Section**
**Solvior Reference:** Line 2181 (Blog section)
**Content:**
- **Section Title:** "Latest News & Updates"
- **Subtitle:** "Stay informed about our innovations and achievements"

**Layout:** 3-column grid showing latest articles
- Article thumbnail image
- Publication date
- Article title
- Short excerpt
- "Read More" link → links to `news-details.html`

**CTA:** "View All News" → links to `news.html`

#### 11. **Contact CTA Section**
**Solvior Reference:** Custom CTA section
**Content:**
- **Headline:** "Ready to Partner with Us?"
- **Subheadline:** "Contact our team to discuss your PET preform or recycling needs"
- **Two CTA Buttons:**
  - "Request Quote" → Contact form
  - "Download Brochure" → PDF download

**Background:** Image or gradient with overlay

#### 12. **Footer**
**Solvior Reference:** Line 2355 (Footer component)
**Content:**

**Column 1: Company Info**
- PetStar logo
- Brief description
- Two addresses:
  - Preforms facility address
  - Recycling facility address
- Phone/Email

**Column 2: Quick Links**
- Story
- Teams
- Products
- Accreditations
- Portfolio

**Column 3: Resources**
- Virtual Tour
- News
- Contact
- Careers
- GDPR Policy

**Column 4: Newsletter**
- "Stay Updated" heading
- Email signup form
- Social media icons

**Copyright Bar:**
- © 2025 PetStar. All rights reserved.
- Terms & Conditions | Privacy Policy | SMI Policy

---

### Content Mapping to Solvior Components

| PetStar Section | Solvior Component | Line Reference | Notes |
|-----------------|-------------------|----------------|-------|
| Header | Header-1 | 147 | Use topbar for language |
| Hero | Hero section | 1202 | Custom headline, circular economy visual |
| Story | About section | 1618 | Add timeline/process diagram |
| Teams | Service cards | 1696 | 2 large cards instead of grid |
| Products | Service grid | 1696 | 3-column grid, tabbed variant |
| Accreditations | Feature grid | 1267 | Badge display with modals |
| Portfolio | Brand slider + Project grid | 2359 + 2061 | Client logos with details |
| Virtual Tour | NEW - Custom slider | Custom | Tabbed image carousel |
| Statistics | Counter section | 1841 | Impact metrics |
| News | Blog section | 2181 | Latest 3 articles |
| Contact CTA | CTA section | Custom | Dual CTA buttons |
| Footer | Footer-1 | 2355 | Two facility addresses |

---

### Key Customizations Required

1. **Circular Economy Graphics**
   - Create/source circular diagram illustration
   - Animated flow showing waste → recycling → preforms
   - Icons for each process step

2. **Two-Team Integration**
   - Consistent branding for both teams
   - Clear differentiation in visuals
   - Separate team pages linked from homepage

3. **Three-Category Products**
   - Filterable product display
   - Category tabs or separate sections
   - Product detail templates

4. **Certification Display**
   - Professional badge layout
   - Modal popups for certificate details
   - Organized by business unit

5. **Virtual Tour Implementation**
   - Tabbed interface for two facilities
   - High-quality facility photography
   - Lightbox gallery functionality

6. **Bilingual Content**
   - All sections in RO/EN
   - Language switcher in header
   - URL structure: `/` (RO) and `/en/` (EN)

---

## 7. DEVELOPMENT WORKFLOW

### Implementation Strategy

**Incremental Section-by-Section Approach**

This project will be implemented one section at a time to ensure quality, proper UI/UX alignment with the template, and full functionality before moving forward.

**Key Principles:**

1. **Modular Development**
   - Each homepage section will be developed as a separate HTML file
   - Each file will contain only that specific section (for testing/review)
   - Sections will be integrated into the final homepage once approved

2. **Quality Assurance per Section**
   - After implementing each section, verify:
     - ✅ UI matches Solvior template design
     - ✅ Responsive design works on all breakpoints
     - ✅ All animations function correctly
     - ✅ All interactive elements work (buttons, links, sliders)
     - ✅ Content is properly integrated
     - ✅ Code is clean and well-organized
   - Only move to next section after current section is complete

3. **Section File Structure**
   ```
   petstar-website/
   ├── sections/                    # Individual section files
   │   ├── section-01-header.html
   │   ├── section-02-hero.html
   │   ├── section-03-story.html
   │   ├── section-04-teams.html
   │   ├── section-05-products.html
   │   ├── section-06-accreditations.html
   │   ├── section-07-portfolio.html
   │   ├── section-08-virtual-tour.html
   │   ├── section-09-statistics.html
   │   ├── section-10-news.html
   │   ├── section-11-contact-cta.html
   │   └── section-12-footer.html
   ├── index.html                   # Final assembled homepage
   └── assets/                      # Shared assets
   ```

4. **Development Order**
   Follow the section order from Section 6 of this document:
   1. Header → 2. Hero → 3. Story → 4. Teams → 5. Products → 6. Accreditations → 7. Portfolio → 8. Virtual Tour → 9. Statistics → 10. News → 11. Contact CTA → 12. Footer

5. **Testing Each Section**
   - Open section HTML file in browser
   - Test all interactive features
   - Verify responsive breakpoints
   - Check animations trigger correctly
   - Validate against Solvior template
   - Make adjustments as needed
   - Get approval before proceeding

---

### Phase 1: Setup (Day 1)

```bash
# 1. Copy Solvior assets
cp -r /home/octavdragoi/code/solvior-html-theme/Template/assets /home/octavdragoi/code/petstar-website/

# 2. Copy index.html as base (for reference)
cp /home/octavdragoi/code/solvior-html-theme/Template/index.html /home/octavdragoi/code/petstar-website/index-template.html

# 3. Create sections directory
mkdir -p /home/octavdragoi/code/petstar-website/sections

# 4. Create custom CSS file
touch /home/octavdragoi/code/petstar-website/assets/css/petstar.css

# 5. Create custom JS file
touch /home/octavdragoi/code/petstar-website/assets/js/petstar.js

# 6. Create images directories
mkdir -p assets/images/{logo,hero,products,partners,certifications,news,teams,story,virtual-tour}
```

### Phase 2: Section-by-Section Implementation (Days 2-20)

**For Each Section:**

1. **Create Section File**
   ```bash
   # Example for header section
   touch sections/section-01-header.html
   ```

2. **Setup Section File Structure**
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>PetStar - [Section Name] Test</title>

       <!-- CSS Dependencies -->
       <link rel="stylesheet" href="../assets/css/bootstrap.min.css" />
       <link rel="stylesheet" href="../assets/css/font-awesome-pro.min.css" />
       <link rel="stylesheet" href="../assets/css/animate.css" />
       <link rel="stylesheet" href="../assets/css/solvior-icons.css" />
       <link rel="stylesheet" href="../assets/css/swiper.min.css" />
       <link rel="stylesheet" href="../assets/css/nice-select.css" />
       <link rel="stylesheet" href="../assets/css/venobox.min.css" />
       <link rel="stylesheet" href="../assets/css/meanmenu.css" />
       <link rel="stylesheet" href="../assets/css/main.css" />
       <link rel="stylesheet" href="../assets/css/petstar.css" />
   </head>
   <body>
       <!-- SECTION CONTENT HERE -->

       <!-- JS Dependencies -->
       <script src="../assets/js/jquery.min.js"></script>
       <script src="../assets/js/bootstrap.bundle.min.js"></script>
       <script src="../assets/js/gsap.min.js"></script>
       <script src="../assets/js/gsap-scroll-trigger.min.js"></script>
       <script src="../assets/js/gsap-split-text.min.js"></script>
       <script src="../assets/js/lenis.min.js"></script>
       <script src="../assets/js/swiper.min.js"></script>
       <script src="../assets/js/nice-select.js"></script>
       <script src="../assets/js/meanmenu.js"></script>
       <script src="../assets/js/venobox.min.js"></script>
       <script src="../assets/js/wow.min.js"></script>
       <script src="../assets/js/appear.min.js"></script>
       <script src="../assets/js/odometer.min.js"></script>
       <script src="../assets/js/main.js"></script>
       <script src="../assets/js/petstar.js"></script>
   </body>
   </html>
   ```

3. **Extract Section from Solvior Template**
   - Locate section in Solvior index.html (use line references from Section 6)
   - Copy HTML structure
   - Paste into section file

4. **Customize for PetStar**
   - Replace content with PetStar-specific text
   - Update image paths
   - Modify links and CTAs
   - Adjust colors/styling in petstar.css if needed

5. **Test Section**
   - Open in browser
   - Test functionality
   - Check responsive design
   - Verify animations
   - Compare with Solvior template

6. **Get Approval**
   - Review UI/UX alignment
   - Confirm functionality
   - Only proceed after section is approved

7. **Move to Next Section**

**Section Implementation Order:**

**Day 2-3: Section 1 - Header**
- Extract header from Solvior line 147
- Customize navigation menu
- Add language switcher
- Test sticky behavior
- Test mobile hamburger menu

**Day 4-5: Section 2 - Hero**
- Extract hero from Solvior line 1202
- Create circular economy visual
- Update headline and copy
- Add stats overlay
- Test animations

**Day 6-7: Section 3 - Story**
- Extract about section from Solvior line 1618
- Create circular flow diagram
- Add process visualization
- Test GSAP animations

**Day 8-9: Section 4 - Teams**
- Extract service cards from Solvior line 1696
- Create two large cards
- Link to team pages
- Add hover effects

**Day 10-11: Section 5 - Products**
- Use service grid from Solvior line 1696
- Create three product categories
- Add tab interface (optional)
- Link to product pages

**Day 12: Section 6 - Accreditations**
- Use feature grid from Solvior line 1267
- Create certification badges
- Add modal functionality
- Organize by business unit

**Day 13: Section 7 - Portfolio**
- Use brand slider from Solvior line 2359
- Add client logos
- Configure Swiper settings
- Test carousel

**Day 14-15: Section 8 - Virtual Tour**
- Create custom tabbed slider
- Add two facility photo galleries
- Implement VenoBox lightbox
- Add download CTA

**Day 16: Section 9 - Statistics**
- Extract counter from Solvior line 1841
- Update metrics
- Test odometer animation

**Day 17: Section 10 - News**
- Extract blog section from Solvior line 2181
- Add news articles
- Link to news pages

**Day 18: Section 11 - Contact CTA**
- Create custom CTA section
- Add dual buttons
- Style with overlay

**Day 19: Section 12 - Footer**
- Extract footer from Solvior line 2355
- Add two facility addresses
- Update all links
- Add newsletter form

**Day 20: Integration**
- Combine all approved sections into index.html
- Final testing of complete homepage
- Cross-section interactions

### Phase 3: Final Homepage Assembly (Day 21)

**Combine All Sections:**
1. Create final `index.html`
2. Include all 12 approved sections in order
3. Add global elements (preloader, cursor, mobile menu)
4. Link all CSS/JS dependencies
5. Test complete page flow
6. Verify cross-section interactions
7. Final responsive testing
8. Performance optimization

### Phase 4: Content Integration (Ongoing)

**Assets Needed:**
- [ ] PetStar logo (SVG + PNG)
- [ ] Favicon
- [ ] Hero image (manufacturing facility)
- [ ] Product photos
- [ ] Team photos (if needed)
- [ ] Client logos (with permission)
- [ ] Certification badges
- [ ] News article images

**Content Needed:**
- [ ] Company description
- [ ] Product descriptions
- [ ] Service offerings
- [ ] Team member bios
- [ ] News articles
- [ ] Contact information
- [ ] Legal policies (GDPR, Terms)

### Phase 4: Additional Pages (Days 6-10)

**Copy relevant Solvior templates:**
- `about.html` → Adapt for PetStar story
- `services.html` → Products page
- `service-details.html` → Product details
- `team.html` → Team page (if needed)
- `blog.html` → News listing
- `blog-details.html` → News article template
- `contact.html` → Contact page

### Phase 5: Customization (Days 11-12)

**Create `assets/css/petstar.css`:**
```css
/* PetStar Brand Overrides */
:root {
  --tj-color-theme-primary: #YOUR_BRAND_COLOR;
  --tj-color-theme-dark: #YOUR_DARK_COLOR;
}

/* Custom adjustments */
.hero-title {
  /* Adjust if needed */
}

/* Add any custom styles */
```

**Create `assets/js/petstar.js`:**
```javascript
(function ($) {
  "use strict";

  // Custom PetStar functionality

  // Language switcher
  // Custom form handling
  // Additional interactions

})(jQuery);
```

### Phase 6: Bilingual Support (Days 13-15)

**Two Approaches:**

**Option A: Separate Folders**
```
/index.html         (English homepage)
/ro/index.html      (Romanian homepage)
```

**Option B: Query Parameter**
```
index.html?lang=en
index.html?lang=ro
```

**Implement with JavaScript:**
- Detect language preference
- Load appropriate content
- Store in localStorage
- Update language switcher

### Phase 7: Testing & Optimization (Days 16-20)

**Checklist:**
- [ ] All links working
- [ ] Forms submitting correctly
- [ ] Images optimized (WebP format)
- [ ] Mobile responsive on all pages
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Animations working smoothly
- [ ] No console errors
- [ ] Page speed optimization
- [ ] SEO meta tags on all pages
- [ ] Accessibility check (WCAG 2.1 AA)

---

## 8. PETSTAR-SPECIFIC REQUIREMENTS

### Brand Identity
**TODO:** Define these values
- **Primary Color:** `#??????` (Replace theme blue)
- **Secondary Color:** `#??????`
- **Logo:** SVG format for header, PNG for various sizes
- **Font:** Keep Lato + Libre Franklin or use custom fonts

### Content Strategy

**Tone of Voice:**
- Professional and authoritative
- Technology-focused
- Quality-oriented
- B2B appropriate
- Trustworthy and reliable

**Key Messages:**
1. Market leadership in Romania & Balkans
2. Advanced Husky technology
3. €9.5M investment in excellence
4. Quality and reliability
5. 16+ years of experience
6. SAP-integrated operations

**SEO Keywords:**
- PET preform manufacturer Romania
- Bottle preforms Balkans
- PET packaging solutions
- Beverage packaging Romania
- Plastic preform supplier
- PET bottle preforms

### Required Pages

**Essential:**
1. ✅ Homepage (Variant 1 adapted)
2. ✅ About Us (company history, team, technology)
3. ✅ Products (preform catalog)
4. ✅ Services (capabilities, custom solutions)
5. ✅ Partners (client showcase)
6. ✅ News/Media (articles, announcements)
7. ✅ Contact (form + location)

**Legal:**
8. ✅ GDPR Policy
9. ✅ Terms & Conditions
10. ✅ Business Ethics

### Asset Requirements

**Images Needed:**
- Manufacturing facility exterior/interior (hero)
- Production line in action
- Finished preform products (various sizes)
- Quality control process
- Team photos (optional)
- Office/building photos
- Certification images

**Logos/Graphics:**
- PetStar logo (multiple formats)
- Favicon set (16x16, 32x32, 180x180, 192x192, 512x512)
- Client logos (with written permission)
- Certification badges (ISO, quality standards)
- Partner logos (Husky, SAP, etc.)

**Dimensions:**
- Hero images: 1920x1080px (WebP)
- Product photos: 800x600px (WebP)
- Team photos: 400x500px (WebP)
- Logo: SVG (vector) + PNG fallback

---

## 9. ANIMATIONS & INTERACTIONS

### GSAP Text Animations

**Usage:**
```html
<h2 class="text-anim">Your heading here</h2>
```

Character-by-character reveal on scroll.

### WOW.js Scroll Animations

**Available Classes:**
```html
<div class="wow fadeInUp" data-wow-delay="0.1s">Content</div>
<div class="wow fadeInLeft" data-wow-delay="0.2s">Content</div>
<div class="wow fadeInRight" data-wow-delay="0.3s">Content</div>
<div class="wow zoomIn" data-wow-delay="0.4s">Content</div>
```

**Delays:** 0.1s, 0.2s, 0.3s, 0.4s, 0.5s

### Swiper Sliders

**Auto-initialized** by class names:
- `.brand-slider-1` - Partner logos
- `.tj-testimonial-slider` - Testimonials
- `.project-slider` - Portfolio items
- `.tj-service-slider` - Services

**Customization:** Edit `assets/js/main.js` slider configurations

### Odometer Counters

**Usage:**
```html
<span class="odometer" data-count="100">0</span>
```

Animates on scroll into view.

---

## 10. QUICK REFERENCE

### Common File Paths
```
Header SCSS: assets/sass/components/_header.scss
Footer SCSS: assets/sass/components/_footer.scss
Hero SCSS: assets/sass/layout/_hero.scss
Buttons SCSS: assets/sass/components/_buttons.scss
Main JS: assets/js/main.js
```

### CSS Classes Quick Reference

**Layout:**
- `.container` - Bootstrap container (max-width: 1320px)
- `.container-fluid` - Full width container
- `.row` - Flexbox row
- `.col-*` - Column grid

**Typography:**
- `.sec-heading` - Section heading wrapper
- `.sub-title` - Small label above title
- `.sec-title` - Section title
- `.text-anim` - GSAP text animation

**Components:**
- `.tj-primary-btn` - Primary button
- `.text-btn` - Text link button
- `.service-item` - Service card
- `.feature-item` - Feature box
- `.counter-item` - Counter/stat

**Animations:**
- `.wow fadeInUp` - Fade in from bottom
- `.text-anim` - GSAP character reveal
- `.move-anim` - Floating animation
- `.zoominout` - Pulse animation

**States:**
- `.active` - Active menu item
- `.sticky` - Sticky header state
- `.opened` - Mobile menu opened

### Icon Reference (Solvior Icons)

Common icons with class `tji-*`:
- `tji-arrow-right` - Right arrow
- `tji-arrow-up` - Up arrow
- `tji-email` - Email icon
- `tji-clock` - Clock icon
- `tji-search` - Search icon
- `tji-check` - Checkmark
- `tji-right-quote` - Quote mark

Font Awesome also available with `fa-*` classes.

---

## 11. TROUBLESHOOTING

### Common Issues

**Sticky Header Not Working:**
- Ensure duplicate header exists with `.header-sticky` class
- Check main.js is loaded
- Verify ScrollTrigger plugin loaded

**Animations Not Playing:**
- Check WOW.js loaded: `assets/js/wow.min.js`
- Verify GSAP loaded: `assets/js/gsap.min.js`
- Check console for JavaScript errors
- Ensure `.text-anim` or `.wow` classes applied

**Slider Not Working:**
- Verify Swiper.js loaded: `assets/js/swiper.min.js`
- Check correct class name (`.tj-testimonial-slider`, etc.)
- Ensure swiper HTML structure correct
- Check console for errors

**Mobile Menu Not Opening:**
- Verify MeanMenu.js loaded: `assets/js/meanmenu.js`
- Check hamburger button class: `.hamburgerBtn`
- Ensure `.mobile_menu` div exists
- Verify main.js loaded

**Forms Not Submitting:**
- Check form action path: `assets/mail/contact-form.php`
- Verify PHP mail function configured on server
- Check required fields have `required` attribute
- Test on live server (not localhost)

### Browser Compatibility

**Tested On:**
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

**Known Issues:**
- Custom cursor disabled on touch devices
- Some animations reduced on mobile for performance
- Parallax effects disabled on tablets/mobile

### Performance Tips

**Image Optimization:**
- Use WebP format (fallback to PNG/JPG)
- Compress images (TinyPNG, ImageOptim)
- Lazy load images below fold
- Use appropriate sizes (don't serve 4K for thumbnails)

**Loading Speed:**
- Minify CSS/JS for production
- Enable GZIP compression on server
- Use CDN for assets
- Defer non-critical JavaScript
- Inline critical CSS

**Animation Performance:**
- Avoid animating `width`, `height`, `top`, `left`
- Use `transform` and `opacity` (GPU-accelerated)
- Reduce animations on mobile
- Use `will-change` sparingly

---

## 12. DEPLOYMENT CHECKLIST

### Pre-Launch

- [ ] All content proofread (RO + EN)
- [ ] All images optimized
- [ ] All links tested
- [ ] Contact form tested
- [ ] Mobile responsive verified
- [ ] Cross-browser tested
- [ ] Page speed tested (GTmetrix, PageSpeed Insights)
- [ ] SEO meta tags on all pages
- [ ] Google Analytics installed
- [ ] Favicon set installed
- [ ] 404 page created
- [ ] XML sitemap generated
- [ ] Robots.txt configured
- [ ] GDPR cookie notice (if needed)
- [ ] Social media meta tags (Open Graph, Twitter Cards)

### Launch Day

- [ ] Backup current site (if replacing existing)
- [ ] Upload files to server
- [ ] Test live site thoroughly
- [ ] Submit sitemap to Google Search Console
- [ ] Check DNS propagation
- [ ] Test SSL certificate
- [ ] Monitor server logs for errors

### Post-Launch

- [ ] Monitor analytics
- [ ] Check for broken links
- [ ] Review user feedback
- [ ] Fix any issues reported
- [ ] Plan content updates
- [ ] Regular backups scheduled

---

## 13. MAINTENANCE

### Regular Tasks

**Weekly:**
- Check for broken links
- Review contact form submissions
- Update news section

**Monthly:**
- Review analytics
- Update content
- Check security updates
- Test forms and functionality

**Quarterly:**
- Audit SEO performance
- Update photos/content
- Review competitor sites
- Plan improvements

---

## RESOURCES

### Documentation
- **Solvior Theme:** `/home/octavdragoi/code/solvior-html-theme/Template/`
- **Bootstrap 5:** https://getbootstrap.com/docs/5.3/
- **GSAP:** https://greensock.com/docs/
- **Swiper:** https://swiperjs.com/

### Tools
- **Image Optimization:** TinyPNG, Squoosh
- **Speed Testing:** GTmetrix, PageSpeed Insights
- **SEO:** Google Search Console, Screaming Frog
- **Accessibility:** WAVE, axe DevTools

---

## NEXT STEPS

1. **Gather Assets**
   - PetStar logo files
   - Brand colors definition
   - Product photos
   - Client logos (with permissions)

2. **Copy Solvior Template**
   - Copy assets folder
   - Copy index.html as base
   - Create custom CSS/JS files

3. **Start Customization**
   - Update header with PetStar branding
   - Customize hero section
   - Replace content section by section

4. **Test & Iterate**
   - Test on mobile devices
   - Optimize performance
   - Refine animations

5. **Build Additional Pages**
   - About, Products, Contact, etc.
   - Ensure consistency

6. **Prepare for Launch**
   - Final QA
   - Deploy to staging
   - Client review
   - Go live!

---

**Last Updated:** 2025-01-03
**Version:** 1.0
**Maintained By:** Claude (AI Development Assistant)
