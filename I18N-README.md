# PetStar Website - Internationalization (i18n) System

## Overview

This website uses a **build-time static site generation** approach for internationalization. The system generates separate localized versions of the site (`/en/` and `/ro/`) from a single source.

## Project Structure

```
petstar-website/
├── src/                          # Source files (single version with placeholders)
│   ├── index.html               # With {{t key}} placeholders
│   ├── news.html
│   ├── sections/                # Section HTML files
│   └── assets/components/       # Shared components
├── locales/
│   ├── en.json                  # English translations
│   └── ro.json                  # Romanian translations
├── dist/                        # Generated output (gitignored)
│   ├── index.html               # Redirects to /ro/
│   ├── en/                      # English site
│   └── ro/                      # Romanian site
├── assets/                      # Shared assets (CSS, JS, images)
├── scripts/
│   ├── build-i18n.js            # Main build script
│   ├── extract-translations.js  # Helper to find translatable text
│   └── bulk-translate.js        # Helper for bulk replacements
├── package.json
└── docker/
    ├── docker-compose.yml       # Includes build service
    └── nginx.conf               # Language routing configuration
```

## Quick Start

### 1. Build Localized Versions

```bash
# Install dependencies
npm install

# Build both language versions
npm run build:i18n

# Watch for changes (auto-rebuild)
npm run watch:i18n
```

### 2. Using Docker

```bash
# Build localized versions
docker compose --profile build up build

# Start web server (serves from /dist/)
docker compose up web -d

# Or both at once
docker compose --profile build up build && docker compose up web -d
```

### 3. Access the Site

- **Default (Romanian):** http://localhost:8081/ → redirects to `/ro/`
- **English:** http://localhost:8081/en/
- **Romanian:** http://localhost:8081/ro/`

## How It Works

### Translation Placeholders

Source files use `{{t key.path}}` syntax for translatable text:

**Example (`src/sections/section-02-hero.html`):**
```html
<h1>{{t hero.title}} <span>{{t hero.titleHighlight}}</span></h1>
<p>{{t hero.subtitle}}</p>
<button>{{t hero.ctaButton}}</button>
```

### Translation Files

**`locales/en.json`:**
```json
{
  "hero": {
    "title": "Closing the Circle: From PET Waste to",
    "titleHighlight": "Premium Preforms",
    "subtitle": "Leading Romania's circular economy...",
    "ctaButton": "Discover Our Story"
  }
}
```

**`locales/ro.json`:**
```json
{
  "hero": {
    "title": "[RO] Closing the Circle: From PET Waste to",
    "titleHighlight": "[RO] Premium Preforms",
    "subtitle": "[RO] Leading Romania's circular economy...",
    "ctaButton": "[RO] Discover Our Story"
  }
}
```

### Build Process

1. **Read source files** from `/src/`
2. **Replace placeholders** with translations from `locales/*.json`
3. **Generate separate folders** `/dist/en/` and `/dist/ro/`
4. **Copy/symlink assets** (shared across languages)
5. **Create root redirect** to default language (Romanian)

## Adding/Editing Translations

### Method 1: Direct Editing (Recommended)

1. Edit translation files directly:
   - `locales/en.json` for English
   - `locales/ro.json` for Romanian

2. Rebuild:
   ```bash
   npm run build:i18n
   ```

### Method 2: Extract Helper

To find translatable text in source files:

```bash
npm run extract
```

This scans `/src/` and lists all headings, titles, and button text.

## Language Switcher

### How It Works

- JavaScript file: `assets/js/language-switcher.js`
- Detects current language from URL (`/en/` or `/ro/`)
- Listens to nice-select dropdown changes
- Redirects to same page in different language

### HTML

```html
<select class="nice-select" id="language-selector">
   <option value="ro">{{t header.langRomanian}}</option>
   <option value="en">{{t header.langEnglish}}</option>
</select>
```

### Behavior

- On `/en/index.html` → Switch to Romanian → `/ro/index.html`
- On `/ro/news.html` → Switch to English → `/en/news.html`
- Preserves query strings and hash fragments

## SEO Configuration

### Hreflang Tags

Added to `src/assets/components/head-common.html`:

```html
<link rel="alternate" hreflang="en" href="https://petstar.ro/en/" />
<link rel="alternate" hreflang="ro" href="https://petstar.ro/ro/" />
<link rel="alternate" hreflang="x-default" href="https://petstar.ro/ro/" />
```

### Language Attribute

Each page has correct `lang` attribute:
- English pages: `<html lang="en">`
- Romanian pages: `<html lang="ro">`

### URL Structure

- English: `https://petstar.ro/en/page.html`
- Romanian: `https://petstar.ro/ro/page.html`
- Root: `https://petstar.ro/` → redirects to `/ro/`

## Nginx Configuration

### Routing Rules

```nginx
# Redirect root to Romanian (default)
location = / {
    return 302 /ro/;
}

# English site
location /en/ {
    ssi on;
    try_files $uri $uri/ /en/index.html;
}

# Romanian site
location /ro/ {
    ssi on;
    try_files $uri $uri/ /ro/index.html;
}
```

### SSI Support

Server-Side Includes (SSI) remain functional:
```html
<!--#include virtual="/sections/section-01-header.html" -->
```

## Development Workflow

### Adding New Content

1. **Update source file** (`src/some-page.html`)
   ```html
   <h1>{{t newSection.heading}}</h1>
   ```

2. **Add translation keys** to `locales/en.json` and `locales/ro.json`
   ```json
   {
     "newSection": {
       "heading": "New Section Heading"
     }
   }
   ```

3. **Rebuild**
   ```bash
   npm run build:i18n
   ```

### Adding New Languages

To add Spanish (`/es/`):

1. Create `locales/es.json`
2. Update `scripts/build-i18n.js`:
   ```javascript
   const LANGUAGES = ['en', 'ro', 'es'];
   ```
3. Add hreflang tag to `head-common.html`
4. Update nginx.conf with `/es/` location block
5. Rebuild

## Translation Status

### Completed ✅
- English (`locales/en.json`) - Complete translations
- Romanian (`locales/ro.json`) - Structure ready, needs translation

### Romanian Translation TODO

The `locales/ro.json` file contains `[RO]` prefixes as placeholders. Replace these with actual Romanian translations:

```json
{
  "hero": {
    "title": "[RO] Closing the Circle: From PET Waste to",
    // Should become:
    "title": "Închiderea Cercului: De la Deșeuri PET la"
  }
}
```

**Search for:** `[RO]` in `locales/ro.json`
**Replace with:** Actual Romanian text

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| **Build** | `npm run build:i18n` | Generate localized sites |
| **Watch** | `npm run watch:i18n` | Auto-rebuild on changes |
| **Extract** | `npm run extract` | Find translatable text |

## Troubleshooting

### Issue: Missing translations show as `{{t key}}`

**Cause:** Translation key not found in JSON file
**Fix:** Add the key to `locales/en.json` and `locales/ro.json`

### Issue: Changes not appearing

**Cause:** Forgot to rebuild
**Fix:** Run `npm run build:i18n`

### Issue: Language switcher not working

**Cause:** JavaScript not loaded or nice-select conflict
**Fix:** Check browser console, ensure `language-switcher.js` is loaded

### Issue: nginx returns 404

**Cause:** Serving from wrong directory
**Fix:** Ensure nginx `root` is `/usr/share/nginx/html/dist`

### Issue: SSI includes not working

**Cause:** SSI not enabled in nginx
**Fix:** Ensure `ssi on;` is set in location blocks

## Best Practices

1. **Always rebuild after changes** to source or translations
2. **Keep translation keys organized** by section (e.g., `hero.*`, `nav.*`)
3. **Use descriptive key names** (e.g., `hero.subtitle` not `hero.text2`)
4. **Keep contact info consistent** (email, phone should be same in both languages)
5. **Test both languages** after making changes
6. **Update hreflang tags** on each page for better SEO

## Files to Translate

### High Priority (User-Facing)
- Section 1: Header/Navigation
- Section 2: Hero
- Section 3: Story
- Section 4: Teams
- Section 5: Products
- Section 6: Certifications
- Section 7: Portfolio
- Section 10: News
- Section 12: Footer

### Medium Priority
- News page
- Certification pages
- SMI Policy page

### Low Priority (Rarely Changed)
- 404 page
- Error pages

## Deployment Checklist

Before deploying:
- [ ] Run `npm run build:i18n`
- [ ] Commit `/dist/` or ensure build runs on server
- [ ] Update Romanian translations (remove `[RO]` placeholders)
- [ ] Test language switcher on both versions
- [ ] Verify hreflang tags are correct
- [ ] Check nginx routing works
- [ ] Test SSI includes render correctly
- [ ] Validate all links work in both languages
- [ ] Check mobile responsive design

## Support

For questions or issues:
- Check this README
- Review `scripts/build-i18n.js` for build logic
- Check browser console for JavaScript errors
- Review nginx logs for routing issues

---

**Last Updated:** 2025-11-10
**System Version:** 1.0
**Default Language:** Romanian (RO)
**Supported Languages:** English (EN), Romanian (RO)
