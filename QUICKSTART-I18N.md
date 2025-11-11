# Quick Start Guide - i18n System

## TL;DR

```bash
# 1. Build localized versions
make build

# 2. Start the server
make up

# 3. Visit the site
# http://localhost:8081/      → redirects to /en/
# http://localhost:8081/en/   → English version
# http://localhost:8081/ro/   → Romanian version
```

**Or using npm directly:**
```bash
npm run build:i18n
cd docker && docker compose up -d
```

## What Was Implemented

✅ **Build-time static site generation** for EN/RO languages
✅ **Source files** moved to `/src/` with `{{t key}}` placeholders
✅ **Translation files** in `/locales/en.json` and `/locales/ro.json`
✅ **Build script** (`npm run build:i18n`) generates `/dist/en/` and `/dist/ro/`
✅ **Language switcher** JavaScript with nice-select dropdown integration
✅ **Hreflang tags** for SEO
✅ **Nginx routing** (`/` → `/ro/`, `/en/`, `/ro/`)
✅ **Docker integration** with build service

## Project Structure Changes

### Before
```
petstar-website/
├── index.html                   # English content
├── sections/
└── assets/
```

### After
```
petstar-website/
├── src/                         # Source files with {{t key}} placeholders
│   ├── index.html
│   └── sections/
├── locales/
│   ├── en.json                  # English translations (COMPLETE)
│   └── ro.json                  # Romanian translations (NEEDS TRANSLATION)
├── dist/                        # Generated (run npm run build:i18n)
│   ├── en/                      # English site
│   └── ro/                      # Romanian site
└── assets/                      # Shared (CSS, JS, images)
```

## Next Steps

### 1. Translate Romanian Content

Open `locales/ro.json` and replace all `[RO]` prefixes with actual Romanian translations:

**Before:**
```json
{
  "hero": {
    "title": "[RO] Closing the Circle: From PET Waste to",
    "titleHighlight": "[RO] Premium Preforms"
  }
}
```

**After:**
```json
{
  "hero": {
    "title": "Închiderea Cercului: De la Deșeuri PET la",
    "titleHighlight": "Preforme Premium"
  }
}
```

Search for `[RO]` in the file and replace with proper translations.

### 2. Rebuild After Changes

Anytime you edit source files (`/src/`) or translations (`/locales/`):

```bash
make build
```

Or use watch mode (auto-rebuild on changes):

```bash
make watch
```

**Using npm directly:**
```bash
npm run build:i18n          # One-time build
npm run watch:i18n          # Watch mode
```

### 3. Deploy

When ready to deploy:

```bash
# Build localized versions
make build

# Start services
make up
```

**Or using Docker directly:**
```bash
npm run build:i18n
cd docker && docker compose up -d
```

## Common Tasks

### Add New Translatable Text

1. **Update source file:**
   ```html
   <!-- src/sections/some-section.html -->
   <h2>{{t newSection.heading}}</h2>
   <p>{{t newSection.description}}</p>
   ```

2. **Add translations:**
   ```json
   // locales/en.json
   {
     "newSection": {
       "heading": "New Section",
       "description": "Description here"
     }
   }
   ```

3. **Rebuild:**
   ```bash
   make build
   ```

### Test Language Switching

1. Build and start server
2. Visit http://localhost:8081/ (should redirect to `/en/`)
3. Click language switcher dropdown
4. Select "Română"
5. Should navigate to `/ro/` version
6. All links and navigation should work correctly

### Add More Languages (e.g., French)

1. Create `locales/fr.json`
2. Edit `scripts/build-i18n.js`:
   ```javascript
   const LANGUAGES = ['en', 'ro', 'fr'];
   ```
3. Add hreflang tag in `src/assets/components/head-common.html`
4. Add nginx location block for `/fr/` in `docker/nginx.conf`
5. Rebuild

## Makefile Commands

All commands should be run from the project root or `docker/` directory:

```bash
make build          # Build i18n localized versions
make watch          # Watch for changes and auto-rebuild
make up             # Start all services
make down           # Stop all services
make restart        # Restart all services
make logs           # View all logs
make logs-web       # View web server logs
make ps             # Show running containers
make help           # Show all available commands
```

### Build and Deploy Workflow

```bash
# 1. Build localized versions
make build

# 2. Start services
make up

# 3. Check status
make ps

# 4. View logs (if needed)
make logs-web
```

### Restart After Changes

```bash
# Rebuild i18n
make build

# Restart web server
make restart
```

## Troubleshooting

**Issue:** Changes not showing
**Fix:** Run `make build` (don't forget this step!)

**Issue:** Page shows `{{t some.key}}`
**Fix:** Key missing in translation file. Add it to `locales/en.json` and `locales/ro.json`

**Issue:** Language switcher not working
**Fix:** Check browser console for errors. Ensure `assets/js/language-switcher.js` exists

**Issue:** 404 errors
**Fix:** Make sure nginx root is set to `/usr/share/nginx/html/dist`

## Important Files

| File | Purpose |
|------|---------|
| `locales/en.json` | English translations (complete) |
| `locales/ro.json` | Romanian translations (NEEDS WORK) |
| `scripts/build-i18n.js` | Build script |
| `package.json` | npm scripts |
| `docker/nginx.conf` | Routing configuration |
| `assets/js/language-switcher.js` | Language switching logic |
| `I18N-README.md` | Full documentation |

## Key Translation File Keys

Main sections to translate in `locales/ro.json`:

- `meta.*` - Page titles and descriptions
- `header.*` - Top bar and navigation
- `nav.*` - Menu items
- `hero.*` - Hero section
- `story.*` - Story section
- `teams.*` - Teams section
- `products.*` - Products section
- `certifications.*` - Certifications section
- `portfolio.*` - Portfolio section
- `news.*` - News section
- `footer.*` - Footer
- `common.*` - Common buttons/labels

## Support

- Full docs: [I18N-README.md](I18N-README.md)
- Project rules: [CLAUDE.md](CLAUDE.md)

---

**Status:** ✅ System implemented and working
**Next Action:** Translate `locales/ro.json` (replace `[RO]` prefixes)
**Default Language:** English (EN)
**Build Command:** `npm run build:i18n`
