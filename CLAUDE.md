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
   - Open: `/home/octavdragoi/code/solvior-html-theme/Template/index.html`
   - Navigate to line reference (e.g., Line 1202 for hero)

2. **Copy HTML Structure**
   - Copy ONLY the section content (not `<head>` or scripts)
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

## CURRENT STATUS

### Completed Sections ✅
- Section 1: Header (dark navigation)
- Section 2: Hero (with heroStack wrapper)
- Section 2B: Features (dummy for curved transition)
- Section 3: Story (border-radius animation)
- Section 4: Teams (card stacking animation)
- Section 12: Footer (4-column layout)

### Pending Sections ⏳
- Section 5: Products
- Section 6: Accreditations
- Section 7: Portfolio
- Section 8: Virtual Tour
- Section 9: Statistics
- Section 10: News
- Section 11: Contact CTA

---

## RESOURCES

- **Solvior Template:** `/home/octavdragoi/code/solvior-html-theme/Template/`
- **Bootstrap 5 Docs:** https://getbootstrap.com/docs/5.3/
- **GSAP Docs:** https://greensock.com/docs/
- **Swiper Docs:** https://swiperjs.com/
