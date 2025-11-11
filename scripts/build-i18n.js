#!/usr/bin/env node

/**
 * Build script for generating localized static sites
 * Replaces {{t key.path}} placeholders with actual translations
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const LOCALES_DIR = path.join(ROOT_DIR, 'locales');
const LANGUAGES = ['en', 'ro'];

/**
 * Deep get value from nested object using dot notation
 * e.g., get(obj, 'hero.title') returns obj.hero.title
 */
function get(obj, path) {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
}

/**
 * Load JSON translation file
 */
function loadTranslations(lang) {
  const filePath = path.join(LOCALES_DIR, `${lang}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error.message);
    return {};
  }
}

/**
 * Replace {{t key.path}} placeholders with translations
 */
function translateContent(content, translations, lang) {
  return content.replace(/\{\{t\s+([^}]+)\}\}/g, (match, key) => {
    const value = get(translations, key.trim());
    if (value === undefined) {
      console.warn(`Missing translation for key "${key}" in ${lang}`);
      return match; // Keep placeholder if translation missing
    }
    return value;
  });
}

/**
 * Process a single file
 */
function processFile(srcPath, distPath, translations, lang) {
  const content = fs.readFileSync(srcPath, 'utf8');
  const translated = translateContent(content, translations, lang);

  // Update lang attribute in HTML tag
  const withLang = translated.replace(
    /<html([^>]*)\s+lang="[^"]*"/i,
    `<html$1 lang="${lang}"`
  ).replace(
    /<html([^>]*)>/i,
    (match) => match.includes('lang=') ? match : `<html$1 lang="${lang}">`
  );

  fs.writeFileSync(distPath, withLang, 'utf8');
}

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Process all HTML files in a directory
 */
function processDirectory(srcDir, distDir, translations, lang) {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(distDir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(srcPath, destPath, translations, lang);
    } else if (entry.name.endsWith('.html')) {
      processFile(srcPath, destPath, translations, lang);
    }
  }
}

/**
 * Build for a single language
 */
function buildLanguage(lang) {
  console.log(`Building ${lang.toUpperCase()}...`);

  const translations = loadTranslations(lang);
  const langDistDir = path.join(DIST_DIR, lang);

  // Clean dist directory for this language
  if (fs.existsSync(langDistDir)) {
    fs.rmSync(langDistDir, { recursive: true, force: true });
  }

  // Process all HTML files
  processDirectory(SRC_DIR, langDistDir, translations, lang);

  console.log(`✓ ${lang.toUpperCase()} built successfully`);
}

/**
 * Copy shared assets to dist
 */
function copyAssets() {
  console.log('Copying shared assets...');

  const assetsDir = path.join(ROOT_DIR, 'assets');

  if (fs.existsSync(assetsDir)) {
    for (const lang of LANGUAGES) {
      const langAssetsDir = path.join(DIST_DIR, lang, 'assets');
      if (fs.existsSync(langAssetsDir)) {
        fs.rmSync(langAssetsDir, { recursive: true, force: true });
      }
      // Always copy instead of symlink to avoid SSI file descriptor exhaustion
      copyDir(assetsDir, langAssetsDir);
    }
    console.log('✓ Assets copied');
  }
}

/**
 * Create root redirect page
 */
function createRootRedirect() {
  console.log('Creating root redirect...');

  const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=/en/">
  <link rel="canonical" href="/en/" />
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="/en/">English version</a>...</p>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), redirectHtml, 'utf8');
  console.log('✓ Root redirect created');
}

/**
 * Main build function
 */
function build() {
  console.log('Starting i18n build...\n');

  // Check if src directory exists
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`ERROR: Source directory not found: ${SRC_DIR}`);
    console.error('Please create /src/ directory and move HTML files there.');
    process.exit(1);
  }

  // Check if locales directory exists
  if (!fs.existsSync(LOCALES_DIR)) {
    console.error(`ERROR: Locales directory not found: ${LOCALES_DIR}`);
    console.error('Please create /locales/ directory with translation files.');
    process.exit(1);
  }

  // Create dist directory
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  // Build each language
  for (const lang of LANGUAGES) {
    buildLanguage(lang);
  }

  // Copy shared assets
  copyAssets();

  // Create root redirect
  createRootRedirect();

  console.log('\n✓ Build completed successfully!');
  console.log(`Output: ${DIST_DIR}/`);
}

/**
 * Watch mode
 */
function watch() {
  console.log('Starting watch mode...\n');
  build();

  const chokidar = require('chokidar');

  const watcher = chokidar.watch([SRC_DIR, LOCALES_DIR], {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });

  watcher.on('change', (filePath) => {
    console.log(`\nFile changed: ${filePath}`);
    build();
  });

  console.log('\nWatching for changes... (Press Ctrl+C to stop)');
}

// Run build or watch
if (process.argv.includes('--watch')) {
  watch();
} else {
  build();
}
