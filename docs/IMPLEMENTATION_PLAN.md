# Static HTML Website Implementation Plan
## Solvior-Style Animations & Layouts

**Project Goal:** Build a modern static HTML website replicating Solvior's animation system and layout structure, using the same technology stack but without WordPress dependencies.

**Last Updated:** 2025-11-02

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Implementation Phases](#implementation-phases)
4. [Key Implementation Details](#key-implementation-details)
5. [Timeline & Resources](#timeline--resources)
6. [Success Criteria](#success-criteria)

---

## Project Structure

```
project-root/
├── index.html                       # Main homepage
├── about.html                       # About page (optional)
├── services.html                    # Services page (optional)
├── contact.html                     # Contact page (optional)
├── assets/
│   ├── css/
│   │   ├── vendor/                  # Third-party CSS
│   │   │   ├── bootstrap.min.css   # Grid system & utilities
│   │   │   ├── animate.css         # Animation library
│   │   │   ├── swiper.min.css      # Carousel styles
│   │   │   ├── font-awesome.min.css # Icons
│   │   │   └── odometer.css        # Counter animations
│   │   ├── core.css                # Base styles, resets, typography
│   │   ├── components.css          # Reusable components (buttons, cards, etc.)
│   │   ├── animations.css          # Custom animation keyframes
│   │   ├── layout.css              # Section layouts (hero, features, footer)
│   │   └── responsive.css          # Media queries
│   ├── js/
│   │   ├── vendor/                 # Third-party JavaScript
│   │   │   ├── jquery.min.js       # DOM manipulation
│   │   │   ├── gsap.min.js         # Core animation engine
│   │   │   ├── ScrollTrigger.min.js # Scroll-based animations
│   │   │   ├── SplitText.min.js    # Text character splitting
│   │   │   ├── wow.min.js          # Scroll reveal library
│   │   │   ├── swiper.min.js       # Carousel/slider
│   │   │   ├── odometer.min.js     # Number counters
│   │   │   ├── isotope.pkgd.min.js # Filtering/layout
│   │   │   └── imagesloaded.min.js # Image load detection
│   │   ├── animations.js           # Animation initialization & config
│   │   ├── components.js           # Component-specific JS (menu, carousel)
│   │   └── main.js                 # Main site functionality
│   ├── images/
│   │   ├── hero/                   # Hero section images
│   │   ├── shapes/                 # Decorative shapes
│   │   ├── icons/                  # Custom icon images
│   │   ├── services/               # Service images
│   │   ├── portfolio/              # Portfolio/project images
│   │   └── backgrounds/            # Background images
│   ├── svg/
│   │   └── icons/                  # SVG icons with animations
│   └── fonts/
│       ├── LibreFranklin/          # Heading font
│       │   ├── LibreFranklin-Regular.woff2
│       │   ├── LibreFranklin-SemiBold.woff2
│       │   └── LibreFranklin-Bold.woff2
│       └── Lato/                   # Body font
│           ├── Lato-Regular.woff2
│           ├── Lato-Bold.woff2
│           └── Lato-Light.woff2
├── includes/                       # Optional: Reusable HTML partials
│   ├── header.html
│   ├── navigation.html
│   └── footer.html
├── .gitignore
├── README.md                       # Project documentation
└── ANIMATION_ANALYSIS.md           # Animation implementation reference
```

---

## Technology Stack

### Core Framework & Layout
| Library | Version | Purpose | CDN / Local |
|---------|---------|---------|-------------|
| **Bootstrap** | 5.3+ | Responsive grid system, utilities | CDN or Local |

### Animation Libraries
| Library | Version | Purpose | License | CDN Link |
|---------|---------|---------|---------|----------|
| **GSAP Core** | 3.12.5+ | Professional animation engine | Free (most features) | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` |
| **GSAP ScrollTrigger** | 3.12.5+ | Scroll-based animation triggers | Free | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js` |
| **GSAP SplitText** | 3.12.5+ | Text character/word splitting | Requires Club GreenSock ($99/yr) or trial | Download from GreenSock |
| **WOW.js** | 1.1.2+ | Scroll reveal animations | MIT (Free) | `https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js` |
| **Animate.css** | 4.1.1+ | Pre-built CSS animations | MIT (Free) | `https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css` |

### UI Components
| Library | Version | Purpose | License |
|---------|---------|---------|---------|
| **Swiper.js** | 11+ | Carousels/sliders | MIT (Free) |
| **Font Awesome** | 6+ | Icon library | Free tier available |
| **Odometer** | Latest | Animated number counters | MIT (Free) |
| **Isotope** | 3+ | Filtering/masonry layouts | GPL or Commercial |

### Utilities
| Library | Version | Purpose |
|---------|---------|---------|
| **jQuery** | 3.7.1+ | DOM manipulation (dependency for some plugins) |
| **imagesLoaded** | 5+ | Detect when images are loaded |

### Typography
- **Libre Franklin** (600 weight) - Headings
- **Lato** (400 weight) - Body text
- Source: Google Fonts or self-hosted

---

## Implementation Phases

### **Phase 1: Project Setup & Foundation** (2-3 hours)

#### Tasks:
1. **Create folder structure**
   - Set up all directories as per structure above
   - Create placeholder files

2. **Download dependencies**
   - Decision: CDN vs local hosting?
     - **CDN**: Faster setup, external dependency
     - **Local**: Full control, works offline, better for production
   - Download all vendor CSS/JS files
   - Download fonts (Libre Franklin, Lato from Google Fonts)

3. **Create base HTML template**
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Site Title</title>

       <!-- Vendor CSS -->
       <link rel="stylesheet" href="assets/css/vendor/bootstrap.min.css">
       <link rel="stylesheet" href="assets/css/vendor/animate.css">
       <link rel="stylesheet" href="assets/css/vendor/swiper.min.css">
       <link rel="stylesheet" href="assets/css/vendor/font-awesome.min.css">

       <!-- Custom CSS -->
       <link rel="stylesheet" href="assets/css/core.css">
       <link rel="stylesheet" href="assets/css/components.css">
       <link rel="stylesheet" href="assets/css/animations.css">
       <link rel="stylesheet" href="assets/css/layout.css">
       <link rel="stylesheet" href="assets/css/responsive.css">
   </head>
   <body>
       <!-- Content -->

       <!-- Vendor JS -->
       <script src="assets/js/vendor/jquery.min.js"></script>
       <script src="assets/js/vendor/gsap.min.js"></script>
       <script src="assets/js/vendor/ScrollTrigger.min.js"></script>
       <script src="assets/js/vendor/wow.min.js"></script>
       <script src="assets/js/vendor/swiper.min.js"></script>

       <!-- Custom JS -->
       <script src="assets/js/animations.js"></script>
       <script src="assets/js/components.js"></script>
       <script src="assets/js/main.js"></script>
   </body>
   </html>
   ```

4. **Set up version control**
   - Initialize git repository
   - Create `.gitignore` for node_modules, DS_Store, etc.

#### Deliverables:
- ✅ Complete folder structure
- ✅ All dependencies downloaded/linked
- ✅ Base HTML template ready
- ✅ Git repository initialized

---

### **Phase 2: CSS Foundation & Design System** (3-4 hours)

#### Tasks:

5. **Create CSS Custom Properties (Design Tokens)**

   File: `assets/css/core.css`

   ```css
   :root {
       /* Colors */
       --color-primary: #0075ff;
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

       --font-weight-normal: 400;
       --font-weight-semibold: 600;
       --font-weight-bold: 700;

       --line-height-tight: 1.2;
       --line-height-normal: 1.5;
       --line-height-relaxed: 1.8;

       /* Spacing */
       --spacing-xs: 0.5rem;    /* 8px */
       --spacing-sm: 1rem;      /* 16px */
       --spacing-md: 1.5rem;    /* 24px */
       --spacing-lg: 2.5rem;    /* 40px */
       --spacing-xl: 4rem;      /* 64px */
       --spacing-2xl: 6rem;     /* 96px */

       /* Breakpoints (for reference in media queries) */
       --breakpoint-mobile: 767px;
       --breakpoint-tablet: 1024px;
       --breakpoint-laptop: 1399px;
       --breakpoint-desktop: 2400px;

       /* Animation */
       --transition-fast: 0.15s;
       --transition-base: 0.3s;
       --transition-slow: 0.6s;
       --easing: ease-in-out;

       /* Z-index layers */
       --z-dropdown: 1000;
       --z-sticky: 1020;
       --z-fixed: 1030;
       --z-modal-backdrop: 1040;
       --z-modal: 1050;
       --z-popover: 1060;
       --z-tooltip: 1070;
   }
   ```

6. **Base styles & CSS reset**
   ```css
   /* Reset */
   *, *::before, *::after {
       box-sizing: border-box;
       margin: 0;
       padding: 0;
   }

   html {
       scroll-behavior: smooth;
   }

   body {
       font-family: var(--font-body);
       font-size: var(--font-size-base);
       line-height: var(--line-height-normal);
       color: var(--color-dark);
       background-color: var(--color-light);
       overflow-x: hidden;
   }

   /* Typography */
   h1, h2, h3, h4, h5, h6 {
       font-family: var(--font-heading);
       font-weight: var(--font-weight-semibold);
       line-height: var(--line-height-tight);
       margin-bottom: var(--spacing-sm);
   }

   /* ... more base styles */
   ```

7. **Utility classes**
   ```css
   /* Container */
   .container {
       max-width: 1200px;
       margin: 0 auto;
       padding: 0 var(--spacing-md);
   }

   /* Section spacing */
   .section {
       padding: var(--spacing-2xl) 0;
   }

   /* Text utilities */
   .text-center { text-align: center; }
   .text-primary { color: var(--color-primary); }

   /* ... more utilities */
   ```

8. **Responsive breakpoints setup**
   File: `assets/css/responsive.css`
   ```css
   /* Mobile First Approach */

   /* Tablet: 768px and up */
   @media (min-width: 768px) {
       .container {
           max-width: 720px;
       }
   }

   /* Desktop: 1024px and up */
   @media (min-width: 1024px) {
       .container {
           max-width: 960px;
       }
   }

   /* Large Desktop: 1400px and up */
   @media (min-width: 1400px) {
       .container {
           max-width: 1200px;
       }
   }
   ```

#### Deliverables:
- ✅ Complete design token system
- ✅ Base styles and reset
- ✅ Responsive breakpoint system
- ✅ Utility classes

---

### **Phase 3: Reusable Component Development** (3-4 hours)

#### Tasks:

9. **Button Components**

   File: `assets/css/components.css`

   ```css
   /* Primary Button */
   .tj-primary-btn {
       display: inline-flex;
       align-items: center;
       gap: var(--spacing-xs);
       padding: 16px 32px;
       font-family: var(--font-heading);
       font-weight: var(--font-weight-semibold);
       font-size: var(--font-size-base);
       color: var(--color-light);
       background-color: var(--color-primary);
       border: 2px solid var(--color-primary);
       border-radius: 50px;
       text-decoration: none;
       transition: all var(--transition-base) var(--easing);
       cursor: pointer;
       overflow: hidden;
       position: relative;
   }

   .tj-primary-btn:hover {
       background-color: transparent;
       color: var(--color-primary);
       transform: translateY(-3px);
       box-shadow: 0 10px 30px rgba(0, 117, 255, 0.3);
   }

   /* Button icon animation */
   .tj-primary-btn .btn_icon {
       display: flex;
       transition: transform var(--transition-base) var(--easing);
   }

   .tj-primary-btn:hover .btn_icon {
       transform: translateX(5px);
   }
   ```

10. **Feature Card Component**
    ```css
    .feature-item {
        padding: var(--spacing-lg);
        background: var(--color-light);
        border-radius: 12px;
        transition: all var(--transition-base) var(--easing);
        position: relative;
        overflow: hidden;
    }

    /* Hover background effect */
    .feature-item.hover-bg::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg,
            rgba(0, 117, 255, 0.05),
            rgba(5, 18, 41, 0.05));
        opacity: 0;
        transition: opacity var(--transition-base) var(--easing);
        z-index: 0;
    }

    .feature-item.hover-bg:hover::before {
        opacity: 1;
    }

    .feature-item:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
        width: 80px;
        height: 80px;
        margin-bottom: var(--spacing-md);
        color: var(--color-primary);
    }

    .feature-title {
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-sm);
    }
    ```

11. **Shine Hover Effect**
    ```css
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
    ```

12. **Line Hover (Animated Underline)**
    ```css
    .line-hover {
        position: relative;
        text-decoration: none;
        color: inherit;
    }

    .line-hover::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: currentColor;
        transition: width var(--transition-base) var(--easing);
    }

    .line-hover:hover::after {
        width: 100%;
    }
    ```

13. **SVG Icon Components**

    File: `assets/css/animations.css`

    ```css
    /* SVG Animation Base */
    .svg-animate svg {
        width: 100%;
        height: 100%;
    }

    .svg-animate svg path {
        stroke: currentColor;
        fill: none;
    }

    /* Example: Square icon animation */
    .icon-square .path-0 {
        stroke-dasharray: 284 286;
        stroke-dashoffset: 285;
        animation: draw-path 2000ms ease-in-out 0ms forwards;
    }

    .icon-square .path-1 {
        stroke-dasharray: 263 265;
        stroke-dashoffset: 264;
        animation: draw-path 2000ms ease-in-out 250ms forwards;
    }

    .icon-square .path-2 {
        stroke-dasharray: 84 86;
        stroke-dashoffset: 85;
        animation: draw-path 2000ms ease-in-out 500ms forwards;
    }

    .icon-square .path-3 {
        stroke-dasharray: 84 86;
        stroke-dashoffset: 85;
        animation: draw-path 2000ms ease-in-out 750ms forwards;
    }

    .icon-square .path-4 {
        stroke-dasharray: 84 86;
        stroke-dashoffset: 85;
        animation: draw-path 2000ms ease-in-out 1000ms forwards;
    }

    @keyframes draw-path {
        100% {
            stroke-dashoffset: 0;
        }
    }
    ```

14. **Section Header Component**
    ```css
    .sec-heading {
        text-align: center;
        margin-bottom: var(--spacing-xl);
    }

    .sub-title {
        display: inline-block;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: var(--spacing-sm);
    }

    .sec-title {
        font-size: var(--font-size-3xl);
        color: var(--color-dark);
        margin-bottom: var(--spacing-md);
    }

    .sec-heading .desc {
        font-size: var(--font-size-lg);
        color: var(--color-gray);
        max-width: 600px;
        margin: 0 auto;
    }
    ```

#### Deliverables:
- ✅ Button components with hover effects
- ✅ Card components (feature, service)
- ✅ Hover effect utilities (shine, background)
- ✅ SVG animation system
- ✅ Section header component

---

### **Phase 4: Section Layout Development** (5-6 hours)

File: `assets/css/layout.css`

#### Tasks:

15. **Hero Section**
    ```html
    <section class="hero-section">
        <div class="container">
            <div class="hero-wrapper">
                <div class="hero-content">
                    <h1 class="hero-title text-anim">
                        Maximize growth qualified business
                        <span class="active-color">consulting</span>
                    </h1>
                    <div class="desc wow fadeInUp" data-wow-delay="0.4s">
                        <p>Transform your business with expert consultancy services</p>
                    </div>
                    <div class="hero-btn">
                        <a href="#" class="tj-primary-btn wow fadeInUp" data-wow-delay="0.8s">
                            Free consultation
                        </a>
                    </div>
                </div>
                <div class="hero-images-box wow fadeInRight" data-wow-delay="0.8s">
                    <img src="assets/images/hero/hero-image.jpg" alt="Hero">
                </div>
            </div>
        </div>
    </section>
    ```

    ```css
    .hero-section {
        padding: var(--spacing-2xl) 0;
        position: relative;
        overflow: hidden;
        min-height: 100vh;
        display: flex;
        align-items: center;
    }

    .hero-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-xl);
        align-items: center;
    }

    .hero-title {
        font-size: 3.5rem;
        line-height: 1.2;
        margin-bottom: var(--spacing-md);
    }

    .active-color {
        color: var(--color-primary);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .hero-wrapper {
            grid-template-columns: 1fr;
        }
    }
    ```

16. **Features Section**
    ```html
    <section class="features-section section">
        <div class="container">
            <div class="sec-heading">
                <span class="sub-title wow fadeInUp" data-wow-delay="0.1s">
                    Number #1 Solver
                </span>
                <h2 class="sec-title text-anim">Explore our core features</h2>
                <div class="desc wow fadeInUp" data-wow-delay="0.3s">
                    <p>Our mission is to empower businesses to thrive</p>
                </div>
            </div>

            <div class="features-grid">
                <div class="feature-item hover-bg wow fadeInUp" data-wow-delay="0.1s">
                    <div class="feature-icon svg-animate">
                        <!-- SVG icon -->
                    </div>
                    <h4 class="feature-title">Quick Solutions</h4>
                    <p>Our mission is to empower businesses</p>
                </div>
                <!-- More feature items -->
            </div>
        </div>
    </section>
    ```

    ```css
    .features-section {
        background-color: var(--color-gray-light);
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-lg);
    }
    ```

17. **About Section**
18. **Services Section**
19. **Statistics Section**
20. **Portfolio Section**
21. **Blog Section**
22. **Footer Section**

#### Deliverables:
- ✅ Hero section with split layout
- ✅ Features section with grid
- ✅ All major page sections coded
- ✅ Responsive layouts for all sections

---

### **Phase 5: Animation Integration** (4-5 hours)

File: `assets/js/animations.js`

#### Tasks:

23. **Initialize WOW.js**
    ```javascript
    // Initialize WOW.js for scroll-triggered animations
    document.addEventListener('DOMContentLoaded', function() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            new WOW({
                boxClass: 'wow',
                animateClass: 'animated',
                offset: 0,
                mobile: true,
                live: true,
                resetAnimation: false
            }).init();
        }
    });
    ```

24. **GSAP Text Animations**
    ```javascript
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Text animation for .text-anim elements
    document.addEventListener('DOMContentLoaded', function() {
        const textAnimElements = document.querySelectorAll('.text-anim');

        textAnimElements.forEach(element => {
            // Simple fade and slide up animation
            gsap.from(element, {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });

            // If SplitText is available, use it
            if (typeof SplitText !== 'undefined') {
                const split = new SplitText(element, {
                    type: "chars,words",
                    charsClass: "char",
                    wordsClass: "word"
                });

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
            }
        });
    });
    ```

25. **SVG Draw Animations**
    ```javascript
    // Trigger SVG animations when in viewport
    const svgAnimElements = document.querySelectorAll('.svg-animate');

    const observerOptions = {
        threshold: 0.5
    };

    const svgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-svg');
                svgObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    svgAnimElements.forEach(el => svgObserver.observe(el));
    ```

26. **Swiper Carousel**
    ```javascript
    // Initialize Swiper
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });
    ```

27. **Counter Animations (Odometer)**
    ```javascript
    // Initialize counters when in view
    const counters = document.querySelectorAll('.odometer');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const finalValue = counter.getAttribute('data-count');
                counter.innerHTML = finalValue;
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counter.innerHTML = '0';
        counterObserver.observe(counter);
    });
    ```

28. **Smooth Scroll**
    ```javascript
    // Smooth scroll to anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    ```

#### Deliverables:
- ✅ WOW.js scroll animations working
- ✅ GSAP text animations implemented
- ✅ SVG draw animations triggering
- ✅ Carousels functioning
- ✅ Counter animations working
- ✅ Smooth scroll enabled

---

### **Phase 6: JavaScript Functionality** (3-4 hours)

File: `assets/js/main.js`

#### Tasks:

29. **Mobile Menu Toggle**
    ```javascript
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    ```

30. **Lazy Loading Images**
    ```javascript
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
    ```

31. **Preloader**
    ```javascript
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
    ```

32. **Form Validation (if needed)**
33. **Accessibility Features**
    ```javascript
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
    ```

#### Deliverables:
- ✅ Mobile navigation working
- ✅ Image lazy loading implemented
- ✅ Preloader animation
- ✅ Basic accessibility features

---

### **Phase 7: Optimization & Polish** (2-3 hours)

#### Tasks:

34. **Minify Assets**
    - Use online tools or build process to minify CSS/JS
    - Create `.min.css` and `.min.js` versions

35. **Image Optimization**
    - Compress all images (TinyPNG, ImageOptim)
    - Convert to WebP where appropriate
    - Implement responsive images with `srcset`

    ```html
    <img
        src="image-800.jpg"
        srcset="image-400.jpg 400w,
                image-800.jpg 800w,
                image-1200.jpg 1200w"
        sizes="(max-width: 768px) 100vw,
               (max-width: 1200px) 50vw,
               33vw"
        alt="Description"
    />
    ```

36. **Performance Optimizations**
    ```css
    /* Add will-change for animated elements */
    .feature-item,
    .hero-images-box {
        will-change: transform, opacity;
    }

    /* Use transform3d for hardware acceleration */
    .tj-primary-btn:hover {
        transform: translate3d(0, -3px, 0);
    }
    ```

37. **Loading States**
    ```css
    /* Skeleton loading screens */
    .skeleton {
        background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
    }

    @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    ```

38. **Cross-browser Testing**
    - Test in Chrome, Firefox, Safari, Edge
    - Check vendor prefixes for CSS properties
    - Ensure fallbacks for modern features

39. **Reduced Motion Support**
    ```css
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    ```

#### Deliverables:
- ✅ All assets minified
- ✅ Images optimized
- ✅ Performance improvements applied
- ✅ Cross-browser compatible
- ✅ Accessibility features implemented

---

### **Phase 8: Testing & Documentation** (2-3 hours)

#### Tasks:

40. **Browser Testing Checklist**
    - [ ] Chrome (latest)
    - [ ] Firefox (latest)
    - [ ] Safari (latest)
    - [ ] Edge (latest)
    - [ ] Mobile Safari (iOS)
    - [ ] Chrome Mobile (Android)

41. **Responsive Testing**
    - [ ] Mobile (320px - 767px)
    - [ ] Tablet (768px - 1023px)
    - [ ] Desktop (1024px - 1399px)
    - [ ] Large Desktop (1400px+)

42. **Animation Testing**
    - [ ] All WOW.js animations trigger correctly
    - [ ] GSAP text animations work smoothly
    - [ ] SVG draw animations play on scroll
    - [ ] Hover effects work on all interactive elements
    - [ ] Carousels slide properly
    - [ ] Counters animate when in view

43. **Performance Testing**
    - [ ] Run Lighthouse audit (target: 90+ performance)
    - [ ] Check Time to Interactive (TTI)
    - [ ] Verify First Contentful Paint (FCP)
    - [ ] Test on slow 3G connection

44. **Accessibility Audit**
    - [ ] Run Lighthouse accessibility audit (target: 100)
    - [ ] Check keyboard navigation
    - [ ] Test with screen reader (NVDA, VoiceOver)
    - [ ] Verify color contrast ratios
    - [ ] Ensure all images have alt text
    - [ ] Check ARIA labels

45. **Documentation**

    Create **README.md**:
    ```markdown
    # Project Name

    Modern static HTML website with advanced animations.

    ## Features
    - Responsive design
    - GSAP & WOW.js animations
    - SVG path animations
    - Carousels with Swiper
    - Optimized performance

    ## Setup
    1. Clone repository
    2. Open index.html in browser
    3. No build process required

    ## Customization
    - Colors: Edit CSS custom properties in `assets/css/core.css`
    - Animations: Adjust timing in `assets/js/animations.js`
    - Content: Update HTML files

    ## Browser Support
    - Chrome 90+
    - Firefox 88+
    - Safari 14+
    - Edge 90+

    ## Performance
    - Lighthouse Score: 95+
    - Accessibility: 100
    - SEO: 100
    ```

46. **Code Documentation**
    - Add comments to complex CSS sections
    - Document JavaScript functions
    - Create inline code examples

#### Deliverables:
- ✅ All tests passing
- ✅ Lighthouse scores meet targets
- ✅ Complete documentation
- ✅ Ready for deployment

---

## Key Implementation Details

### Animation Timing Strategy

| Element Type | Duration | Delay Pattern | Easing |
|-------------|----------|---------------|--------|
| Entrance (WOW) | 600-1000ms | 0.1s increments | ease-out |
| Text reveals (GSAP) | 800-1200ms | 0.02s stagger | back.out(1.7) |
| SVG draws | 2000ms | 250-500ms stagger | ease-in-out |
| Hover effects | 300ms | Immediate | ease-in-out |
| Carousel transitions | 600ms | Auto 5000ms | ease |
| Counter animations | 1500ms | On viewport entry | linear |

### CSS Architecture (BEM-inspired)

```
Block__Element--Modifier

Examples:
.hero-section
.hero-section__content
.hero-section__title
.hero-section__title--large

.feature-item
.feature-item__icon
.feature-item__title
.feature-item--highlighted
```

### Mobile-First Responsive Strategy

1. **Write base styles for mobile** (320px+)
2. **Add tablet overrides** at 768px
3. **Add desktop overrides** at 1024px
4. **Add large desktop overrides** at 1400px

```css
/* Mobile first (base) */
.hero-title {
    font-size: 2rem;
}

/* Tablet */
@media (min-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .hero-title {
        font-size: 3.5rem;
    }
}
```

### Performance Best Practices

1. **Use CSS transforms over position** for animations
2. **Add `will-change`** for elements that will animate
3. **Lazy load images** below the fold
4. **Defer non-critical JavaScript**
5. **Minify and compress** all assets
6. **Use WebP images** with JPEG/PNG fallbacks
7. **Implement critical CSS** inline for above-the-fold content
8. **Preload key resources** (fonts, hero images)

---

## Timeline & Resources

### Estimated Timeline

| Phase | Tasks | Hours | Cumulative |
|-------|-------|-------|-----------|
| 1. Setup & Structure | 1-4 | 2-3h | 2-3h |
| 2. CSS Foundation | 5-8 | 3-4h | 5-7h |
| 3. Components | 9-14 | 3-4h | 8-11h |
| 4. Sections | 15-22 | 5-6h | 13-17h |
| 5. Animations | 23-28 | 4-5h | 17-22h |
| 6. JavaScript | 29-33 | 3-4h | 20-26h |
| 7. Optimization | 34-39 | 2-3h | 22-29h |
| 8. Testing & Docs | 40-46 | 2-3h | 24-32h |

**Total Estimated Time: 24-32 hours**

### Resource Requirements

**Required Skills:**
- HTML5 & semantic markup
- CSS3 (Grid, Flexbox, animations)
- JavaScript (ES6+)
- Responsive design principles
- Basic Git knowledge

**Tools Needed:**
- Code editor (VS Code recommended)
- Modern browser with DevTools
- Image optimization tools
- Git for version control
- Optional: Local server (Live Server extension)

**Budget Considerations:**
- **GSAP SplitText**: $99/year (optional, can achieve similar with free alternatives)
- **Font Awesome Pro**: $99/year (optional, free tier available)
- All other libraries: **Free/Open Source**

---

## Success Criteria

### Functional Requirements
- ✅ All animations work smoothly at 60fps
- ✅ Responsive design works 320px to 2400px+
- ✅ No WordPress or backend dependencies
- ✅ Cross-browser compatible (last 2 versions)
- ✅ Mobile-friendly navigation
- ✅ All interactions provide visual feedback

### Performance Metrics
- ✅ **Lighthouse Performance**: 90+
- ✅ **Lighthouse Accessibility**: 100
- ✅ **Lighthouse Best Practices**: 95+
- ✅ **Lighthouse SEO**: 100
- ✅ **First Contentful Paint**: < 1.5s
- ✅ **Time to Interactive**: < 3.5s
- ✅ **Total Page Weight**: < 2MB

### Code Quality
- ✅ Clean, organized file structure
- ✅ Commented code for complex sections
- ✅ Consistent naming conventions
- ✅ No console errors or warnings
- ✅ Valid HTML5 (W3C validator)
- ✅ Valid CSS3
- ✅ ES6+ JavaScript with proper scope

### User Experience
- ✅ Intuitive navigation
- ✅ Fast loading (perceived performance)
- ✅ Smooth scrolling
- ✅ Delightful animations (not distracting)
- ✅ Keyboard accessible
- ✅ Screen reader friendly
- ✅ Touch-friendly on mobile

---

## Next Steps

After completion of this plan:

1. **Content Population**: Add real content (text, images, copy)
2. **SEO Optimization**: Add meta tags, Open Graph, structured data
3. **Deployment**: Choose hosting (Netlify, Vercel, GitHub Pages)
4. **Domain Setup**: Configure custom domain
5. **Analytics**: Add Google Analytics or privacy-friendly alternative
6. **Monitoring**: Set up uptime monitoring
7. **Maintenance Plan**: Create update schedule for dependencies

---

**Document Version:** 1.0
**Last Updated:** 2025-11-02
**Author:** Claude
**Reference:** Based on analysis of https://solvior.themejunction.net/
