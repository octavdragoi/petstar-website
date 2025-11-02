# Solvior Website - Complete Animation Analysis

## Executive Summary

The Solvior website uses a **multi-layered animation system** combining:
- **GSAP (GreenSock Animation Platform)** - Professional-grade JavaScript animation library
- **WOW.js** - Scroll-triggered CSS animation library
- **Animate.css** - Pre-built CSS animation classes
- **Custom SVG animations** - Inline CSS keyframe animations
- **CSS transitions** - For hover and interactive states

All of these libraries are **fully reusable** on other websites and are not proprietary to WordPress.

---

## 1. Animation Libraries & Frameworks

### Primary Animation Stack

| Library | Version | Purpose | File Location |
|---------|---------|---------|---------------|
| **GSAP Core** | Latest | Advanced timeline-based animations | `/assets/js/gsap.min.js` |
| **GSAP ScrollTrigger** | Latest | Scroll-based animation triggers | `/assets/js/gsap-scroll-trigger.min.js` |
| **GSAP SplitText** | Latest | Text character/word splitting for animations | `/assets/js/gsap-split-text.min.js` |
| **GSAP ScrollToPlugin** | Latest | Smooth scrolling functionality | `/assets/js/scroll-to-plugin.min.js` |
| **WOW.js** | Latest | Scroll reveal animations | `/assets/js/wow.min.js` |
| **Animate.css** | Latest | CSS animation classes | `/assets/css/animate.css` |
| **Swiper** | Latest | Carousel/slider animations | `/assets/js/swiper.min.js` |

### Supporting Animation Libraries

| Library | Purpose |
|---------|---------|
| **Smooth Scroll** | Smooth scrolling behavior |
| **Appear.js** | Viewport detection for triggering animations |
| **Odometer** | Animated number counters |
| **Isotope** | Animated filtering and layout |
| **Magnific Popup** | Modal/lightbox animations with effects |

---

## 2. Animation Types & Implementation

### A. Scroll-Triggered Animations (WOW.js + Animate.css)

**How It Works:**
- Elements get `wow` class + animation class (e.g., `fadeInUp`, `fadeInRight`)
- Animations trigger when elements enter viewport
- Delays create stagger effects

**HTML Pattern:**
```html
<div data-wow-delay="0.1s" class="feature-item wow fadeInUp">
    <!-- content -->
</div>
```

**Common Animation Classes Used:**
- `fadeInUp` - Fade in from bottom
- `fadeInRight` - Fade in from right
- `fadeInLeft` - Fade in from left
- `fadeIn` - Simple fade in

**Delay Pattern:**
Sequential elements use incremental delays (0.1s, 0.3s, 0.5s, 0.7s) to create a staggered cascade effect.

**Examples Found:**
```html
<!-- Hero section elements with staggered timing -->
<div data-wow-delay="0.4s" class="desc wow fadeInUp">...</div>
<a data-wow-delay="0.8s" class="tj-primary-btn hero-button wow fadeInUp">...</a>

<!-- Feature cards with 0.2s increments -->
<div data-wow-delay="0.1s" class="feature-item wow fadeInUp">...</div>
<div data-wow-delay="0.3s" class="feature-item wow fadeInUp">...</div>
<div data-wow-delay="0.5s" class="feature-item wow fadeInUp">...</div>
<div data-wow-delay="0.7s" class="feature-item wow fadeInUp">...</div>
```

---

### B. GSAP Text Animations

**How It Works:**
- Uses GSAP SplitText to break text into characters/words
- Animates each character individually
- Creates sophisticated text reveal effects

**HTML Pattern:**
```html
<h1 class="hero-title text-anim">Maximise growth qualified business consulting</h1>
<h2 class="sec-title text-anim">Explore our core features</h2>
```

**Implementation:**
The `.text-anim` class is targeted by GSAP JavaScript to:
1. Split text into individual characters/words
2. Animate each piece with ScrollTrigger
3. Create reveal effects as user scrolls

**Common in:**
- Main headings (`<h1>`, `<h2>`)
- Hero titles
- Section titles

---

### C. SVG Path Animations

**How It Works:**
- Uses CSS `stroke-dasharray` and `stroke-dashoffset` technique
- Animates SVG paths to "draw" themselves on screen
- Staggered delays create sequential drawing effect

**HTML Pattern:**
```html
<div class="feature-icon el-icon svg-animate">
    <svg width="81" height="81" viewBox="0 0 81 81">
        <path stroke="currentcolor" stroke-width="1.01408"
              d="M5.00704 5.00704 L75.99294 5.00704..."
              class="bQDqtfGb_0">
        </path>
    </svg>
</div>
```

**CSS Implementation:**
```css
/* Path animation keyframes */
@keyframes bQDqtfGb_draw {
    100% {
        stroke-dashoffset: 0;
    }
}

@keyframes bQDqtfGb_fade {
    0% { stroke-opacity: 1; }
    94.44444444444444% { stroke-opacity: 1; }
    100% { stroke-opacity: 0; }
}

/* Applied to each path with staggered delays */
.bQDqtfGb_0 {
    stroke-dasharray: 284 286;
    stroke-dashoffset: 85;
    animation: bQDqtfGb_draw 2000ms ease-in-out 0ms forwards;
}

.bQDqtfGb_1 {
    stroke-dasharray: 284 286;
    stroke-dashoffset: 85;
    animation: bQDqtfGb_draw 2000ms ease-in-out 250ms forwards;
}

.bQDqtfGb_2 {
    stroke-dasharray: 284 286;
    stroke-dashoffset: 85;
    animation: bQDqtfGb_draw 2000ms ease-in-out 500ms forwards;
}
/* ... continues with 750ms, 1000ms delays */
```

**Animation Parameters:**
- **Duration:** 2000ms (2 seconds)
- **Easing:** ease-in-out (smooth acceleration/deceleration)
- **Delays:** 0ms, 250ms, 500ms, 750ms, 1000ms (staggered)
- **Direction:** forwards (maintains final state)

**Multiple SVG Animation Examples:**

1. **Square/Rectangle Icon** (`bQDqtfGb`) - 5 paths
2. **Hexagon Icon** (`GZoqilTp`) - 8 paths, delays: 0-1000ms in ~142ms increments
3. **Circle Icon** (`GAqZQeDS`) - 4 paths, delays: 0, 333ms, 666ms, 1000ms
4. **Geometric Pattern** (`idsUcHxq`) - 3 paths, delays: 0, 500ms, 1000ms

---

### D. Hover Animations

**Types of Hover Effects:**

1. **Background Hover** (`.hover-bg`)
   - Adds background color/gradient on hover
   - Used on feature cards and service items
   ```html
   <div class="feature-item hover-bg">...</div>
   ```

2. **Shine Effect** (`.hover:shine`)
   - Creates a light/shine effect on hover
   - Applied to images and shapes
   ```html
   <div class="about-shape-1 hover:shine">...</div>
   <div class="service-images hover:shine">...</div>
   ```

3. **Line Hover** (`.line-hover`)
   - Animated underline effect
   - Used on links
   ```html
   <a class="line-hover" href="mailto:support@solvior.com">support@solvior.com</a>
   ```

---

### E. Number Counter Animations

**Library:** Odometer.js + PureCounter.js

**Purpose:** Animated counting numbers (stats, metrics)

**Implementation:**
```javascript
// Odometer for rolling number animations
// PureCounter for counting up to target value
```

**Typical Usage:**
- Statistics sections (years of experience, client count, success rate)
- Metric displays
- Achievement counters

---

### F. Carousel/Slider Animations

**Library:** Swiper.js

**Features:**
- Slide transitions
- Autoplay with pause on hover
- Touch/swipe gestures
- Pagination dots animation
- Navigation arrows

**Used For:**
- Service showcases
- Portfolio galleries
- Testimonials
- Image carousels

---

### G. Modal/Popup Animations

**Library:** Magnific Popup

**Effect Configuration:**
```javascript
woosq_vars = {
    "effect": "mfp-3d-unfold",  // 3D unfold animation
    // ... other settings
}
```

**Animation Effects:**
- 3D unfold transition
- Zoom animations
- Fade effects

---

### H. Filtering/Layout Animations

**Library:** Isotope.js

**Features:**
- Animated filtering (portfolio, blog posts)
- Smooth layout transitions
- Masonry grid animations
- Sort animations

**Dependencies:**
- imagesloaded.js (ensures images load before animation)

---

## 3. Detailed Code Examples

### Example 1: WOW.js Scroll Animation

**Complete Implementation:**

```html
<!-- HTML -->
<div data-wow-delay="0.1s" class="feature-item hover-bg wow fadeInUp">
    <div class="feature-icon el-icon svg-animate">
        <!-- SVG content -->
    </div>
    <h4 class="title">Quick solutions</h4>
    <p>Our mission is to empower businesses thrive solutions</p>
</div>
```

```javascript
// JavaScript initialization (in theme core)
new WOW({
    boxClass: 'wow',      // Class name to trigger animation
    animateClass: 'animated', // Animation class name
    offset: 0,            // Distance to trigger (px)
    mobile: true,         // Trigger on mobile
    live: true            // Act on DOM changes
}).init();
```

```css
/* Animate.css provides the animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

.fadeInUp {
    animation-name: fadeInUp;
}
```

**How to Replicate:**
1. Include `animate.css` stylesheet
2. Include `wow.min.js` script
3. Initialize WOW on page load
4. Add `wow` class + animation class to elements
5. Use `data-wow-delay` for timing

---

### Example 2: SVG Draw Animation

**Complete Implementation:**

```html
<!-- HTML -->
<div class="feature-icon el-icon svg-animate">
    <svg width="81" height="81" viewBox="0 0 81 81" fill="none">
        <path stroke="currentcolor" stroke-width="1.01408"
              d="M5.00704 5.00704 L75.99294 5.00704 L75.99294 75.99294 L5.00704 75.99294 Z"
              class="bQDqtfGb_0">
        </path>
        <path stroke="currentcolor" stroke-width="1.01408"
              d="M10.0141 10.0141 L70.9859 10.0141 L70.9859 70.9859 L10.0141 70.9859 Z"
              class="bQDqtfGb_1">
        </path>
        <!-- More paths... -->
    </svg>
</div>
```

```css
/* CSS - Inline in HTML or separate stylesheet */
.svg-animate svg path {
    stroke-dasharray: 284 286;
    stroke-dashoffset: 85;
}

/* Individual path animations */
.bQDqtfGb_0 {
    animation: bQDqtfGb_draw 2000ms ease-in-out 0ms forwards;
}

.bQDqtfGb_1 {
    animation: bQDqtfGb_draw 2000ms ease-in-out 250ms forwards;
}

.bQDqtfGb_2 {
    animation: bQDqtfGb_draw 2000ms ease-in-out 500ms forwards;
}

.bQDqtfGb_3 {
    animation: bQDqtfGb_draw 2000ms ease-in-out 750ms forwards;
}

.bQDqtfGb_4 {
    animation: bQDqtfGb_draw 2000ms ease-in-out 1000ms forwards;
}

/* Keyframe definition */
@keyframes bQDqtfGb_draw {
    100% {
        stroke-dashoffset: 0;
    }
}

@keyframes bQDqtfGb_fade {
    0% {
        stroke-opacity: 1;
    }
    94.44444444444444% {
        stroke-opacity: 1;
    }
    100% {
        stroke-opacity: 0;
    }
}
```

**How It Works:**
1. **stroke-dasharray**: Defines the pattern of dashes/gaps (284px dash, 286px gap)
2. **stroke-dashoffset**: Initial offset (85px) - controls starting position
3. **Animation**: Reduces dashoffset to 0, creating "drawing" effect
4. **Stagger**: Each path has increasing delay for sequential animation

**How to Replicate:**
1. Calculate total path length using JavaScript: `path.getTotalLength()`
2. Set `stroke-dasharray` to path length
3. Set `stroke-dashoffset` to same value (makes path invisible)
4. Animate `stroke-dashoffset` to 0
5. Add staggered delays for multiple paths

---

### Example 3: GSAP Text Animation

**Typical Implementation Pattern:**

```html
<!-- HTML -->
<h1 class="hero-title text-anim">
    Maximise growth qualified business <span class="active-color">consulting</span>
</h1>
```

```javascript
// JavaScript (using GSAP + SplitText)
gsap.registerPlugin(ScrollTrigger);

// Split text into characters
const textElements = document.querySelectorAll('.text-anim');

textElements.forEach(element => {
    // Split text
    const split = new SplitText(element, {
        type: "chars,words",
        charsClass: "char",
        wordsClass: "word"
    });

    // Animate characters
    gsap.from(split.chars, {
        duration: 0.8,
        opacity: 0,
        y: 50,
        rotationX: -90,
        stagger: 0.02,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});
```

**How to Replicate:**
1. Include GSAP core + SplitText plugin
2. Target elements with specific class
3. Use SplitText to break into chars/words
4. Create GSAP timeline with stagger
5. Add ScrollTrigger for scroll-based activation

---

### Example 4: Hover Effects

```css
/* Background Hover Effect */
.hover-bg {
    position: relative;
    transition: all 0.3s ease;
}

.hover-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,117,255,0.05), rgba(5,18,41,0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
}

.hover-bg:hover::before {
    opacity: 1;
}

/* Shine Effect */
.hover\:shine {
    position: relative;
    overflow: hidden;
}

.hover\:shine::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    bottom: -50%;
    left: -50%;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
    );
    transform: rotateZ(45deg) translateY(-100%);
    transition: transform 0.6s ease;
}

.hover\:shine:hover::after {
    transform: rotateZ(45deg) translateY(100%);
}

/* Line Hover - Animated Underline */
.line-hover {
    position: relative;
    text-decoration: none;
}

.line-hover::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: currentColor;
    transition: width 0.3s ease;
}

.line-hover:hover::after {
    width: 100%;
}
```

---

## 4. Animation Settings & Configuration

### WOW.js Configuration

```javascript
new WOW({
    boxClass: 'wow',           // Class to trigger
    animateClass: 'animated',  // Class added during animation
    offset: 0,                 // Distance from viewport to trigger
    mobile: true,              // Enable on mobile
    live: true,                // Act on asynchronously loaded content
    scrollContainer: null,     // Optional scroll container
    resetAnimation: false      // Reset animation on scroll up
}).init();
```

### Common Timing Patterns

**Stagger Delays:**
- **Small increments:** 0.1s, 0.2s, 0.3s (for grouped elements)
- **Medium increments:** 0.2s, 0.4s, 0.6s (for sections)
- **Large increments:** 0.3s, 0.5s, 0.7s (for major blocks)

**Animation Durations:**
- **Quick:** 300-500ms (hover states, micro-interactions)
- **Medium:** 600-1000ms (scroll reveals, fades)
- **Long:** 1500-2000ms (SVG draws, complex animations)

**Easing Functions:**
- `ease-in-out` - Smooth start and end (most common)
- `ease-out` - Quick start, slow end (entrance animations)
- `ease-in` - Slow start, quick end (exit animations)
- `back.out(1.7)` - GSAP elastic bounce effect

---

## 5. Reusability Assessment

### ✅ Completely Reusable (No WordPress Dependencies)

#### GSAP Animation Suite
- **License:** Free for most uses, commercial license for advanced features
- **Installation:**
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  ```
- **Use Cases:** Any website requiring professional animations
- **Framework Agnostic:** Works with React, Vue, Angular, vanilla JS

#### WOW.js + Animate.css
- **License:** MIT (completely free)
- **Installation:**
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js"></script>
  ```
- **Use Cases:** Quick scroll-triggered animations
- **Ease of Use:** 10/10 - Just add classes

#### SVG Path Animations
- **License:** CSS animations are standard web tech (free)
- **Installation:** Copy CSS keyframes, apply to your SVGs
- **Use Cases:** Icon animations, logo reveals, decorative elements
- **Customization:** Fully customizable timing, easing, paths

#### Swiper.js
- **License:** MIT (free)
- **Installation:**
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  ```
- **Use Cases:** Carousels, sliders, galleries
- **Framework Support:** Official React, Vue, Angular components available

---

### ⚠️ Partially Reusable (May Need Adaptation)

#### Elementor-Specific Classes
Some animations use Elementor's class structure:
```html
<div class="elementor-element elementor-widget">
```

**Solution:**
- Extract the animation logic from Elementor classes
- Apply to your own HTML structure
- Only the animation code matters, not the HTML structure

#### WordPress-Specific Scripts
Theme file `solvior-core.js` may contain WordPress-specific initialization.

**Solution:**
- Extract pure animation logic
- Rewrite initialization for your platform
- GSAP/WOW code itself is portable

---

### 🚫 Not Reusable (WordPress-Specific)

#### WooCommerce Animations
Product quick view and cart animations are tied to WooCommerce:
```javascript
woosq_vars = {...}  // WooCommerce Quick View
woosw_vars = {...}  // WooCommerce Wishlist
```

**Alternative:**
- Use Magnific Popup independently for modals
- Implement cart animations with GSAP instead

---

## 6. Implementation Guide for Non-WordPress Sites

### Step 1: Include Core Libraries

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Animate.css for WOW animations -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

    <!-- Your custom styles -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Your content -->

    <!-- GSAP Core -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

    <!-- WOW.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js"></script>

    <!-- Initialize -->
    <script src="app.js"></script>
</body>
</html>
```

### Step 2: Initialize Animations

```javascript
// app.js

// Initialize WOW.js
new WOW({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 0,
    mobile: true,
    live: true
}).init();

// GSAP ScrollTrigger for text animations
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.text-anim').forEach(element => {
    gsap.from(element.children || element, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: element,
            start: "top 80%",
        }
    });
});
```

### Step 3: Add Animation Classes to HTML

```html
<!-- Scroll-triggered fade in -->
<div class="wow fadeInUp" data-wow-delay="0.2s">
    <h2>Your heading</h2>
    <p>Your content</p>
</div>

<!-- GSAP text animation -->
<h1 class="text-anim">Animated text reveals</h1>

<!-- SVG animation -->
<div class="svg-animate">
    <svg viewBox="0 0 100 100">
        <path class="draw-path" d="..."/>
    </svg>
</div>
```

### Step 4: Add Custom CSS

```css
/* SVG Draw Animation */
.svg-animate path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: draw 2s ease-out forwards;
}

@keyframes draw {
    to {
        stroke-dashoffset: 0;
    }
}

/* Hover effects */
.hover-card {
    transition: transform 0.3s ease;
}

.hover-card:hover {
    transform: translateY(-10px);
}
```

---

## 7. Performance Considerations

### Best Practices Used

1. **will-change Property**
   - Hints browser about upcoming animations
   - Used for transform/opacity animations
   ```css
   .animated-element {
       will-change: transform, opacity;
   }
   ```

2. **Transform over Position**
   - Uses `transform: translateX()` instead of `left/right`
   - Hardware accelerated, better performance

3. **Opacity Animations**
   - Animates opacity, not visibility/display
   - Smooth and performant

4. **RequestAnimationFrame**
   - GSAP uses rAF for smooth 60fps animations
   - Automatically optimized

5. **Lazy Initialization**
   - Animations only initialize when needed
   - Reduces initial page load

### Optimization Tips

```javascript
// Disable animations on low-end devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Skip WOW initialization
} else {
    new WOW().init();
}

// Pause animations when not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});
```

---

## 8. Browser Compatibility

### Supported Browsers

| Library | IE11 | Edge | Chrome | Firefox | Safari |
|---------|------|------|--------|---------|--------|
| GSAP | ✅ | ✅ | ✅ | ✅ | ✅ |
| WOW.js | ✅ | ✅ | ✅ | ✅ | ✅ |
| Animate.css | ✅ | ✅ | ✅ | ✅ | ✅ |
| SVG Animations | ❌ | ✅ | ✅ | ✅ | ✅ |
| Swiper | ❌ | ✅ | ✅ | ✅ | ✅ |

### Polyfills Needed

```javascript
// IntersectionObserver polyfill for older browsers
<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>
```

---

## 9. Cost Analysis

### Free & Open Source
- ✅ **Animate.css** - MIT License
- ✅ **WOW.js** - MIT License
- ✅ **GSAP (most features)** - Free for most sites
- ✅ **Swiper** - MIT License
- ✅ **SVG animations** - Standard CSS

### Paid (Optional)
- 💰 **GSAP Club** ($99/year) - For advanced plugins like:
  - MorphSVG
  - DrawSVG
  - ScrambleText
  - Physics2D

  **Note:** Solvior uses free GSAP features only

---

## 10. Summary & Recommendations

### What Makes Solvior's Animations Great

1. **Layered Approach**: Combines multiple animation types for richness
2. **Performance**: Uses hardware-accelerated transforms
3. **Timing**: Carefully choreographed delays create flow
4. **Subtlety**: Animations enhance, don't distract
5. **Professionalism**: Uses industry-standard libraries (GSAP)

### Recommended Implementation Order

**For Beginners:**
1. Start with **WOW.js + Animate.css** (easiest)
2. Add **SVG path animations** (pure CSS)
3. Implement **CSS hover effects**

**For Intermediate:**
4. Add **GSAP ScrollTrigger** for advanced scroll effects
5. Implement **Swiper** for carousels
6. Add **counter animations** (Odometer/PureCounter)

**For Advanced:**
7. Master **GSAP timelines** for complex sequences
8. Implement **SplitText** animations
9. Create **custom easing functions**

### Key Takeaway

**100% of the animation techniques are reusable** on any website. The only WordPress-specific parts are:
- File paths (easily changed)
- WooCommerce-specific cart animations (not needed for most sites)
- Elementor HTML structure (animation logic is portable)

You can achieve the exact same visual effects on:
- Static HTML sites
- React applications
- Vue.js projects
- Angular apps
- Any other web platform

---

## Resources & Links

### Official Documentation
- **GSAP:** https://greensock.com/docs/
- **Animate.css:** https://animate.style/
- **WOW.js:** https://wowjs.uk/
- **Swiper:** https://swiperjs.com/

### CDN Links
```html
<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- WOW.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js"></script>

<!-- Animate.css -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

<!-- Swiper -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

### Learning Resources
- **GSAP Learning:** https://greensock.com/learning/
- **CodePen Examples:** https://codepen.io/GreenSock/
- **SVG Animation Tutorial:** https://css-tricks.com/svg-line-animation-works/

---

**Last Updated:** 2025-11-02
**Analyzed Website:** https://solvior.themejunction.net/
**Cache Location:** `./cached-solvior/index.html`
