#!/usr/bin/env node

/**
 * Helper script to extract translatable text from HTML files
 * This is a semi-automated tool - manual review is still needed
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

function extractFromHTML(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const suggestions = [];

  // Extract title tags
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    suggestions.push({
      type: 'title',
      text: titleMatch[1].trim(),
      line: content.substring(0, titleMatch.index).split('\n').length
    });
  }

  // Extract meta descriptions
  const metaDesc = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (metaDesc) {
    suggestions.push({
      type: 'meta-description',
      text: metaDesc[1].trim(),
      line: content.substring(0, metaDesc.index).split('\n').length
    });
  }

  // Extract h1-h6 headings
  const headings = content.matchAll(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi);
  for (const match of headings) {
    suggestions.push({
      type: 'heading',
      text: match[1].trim(),
      line: content.substring(0, match.index).split('\n').length
    });
  }

  // Extract button text
  const buttons = content.matchAll(/<[^>]*class="[^"]*btn[^"]*"[^>]*>([^<]+)</gi);
  for (const match of buttons) {
    const text = match[1].trim();
    if (text && !text.startsWith('<')) {
      suggestions.push({
        type: 'button',
        text: text,
        line: content.substring(0, match.index).split('\n').length
      });
    }
  }

  return suggestions;
}

function analyzeDirectory(dir, baseDir = dir) {
  const results = {};

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      Object.assign(results, analyzeDirectory(fullPath, baseDir));
    } else if (entry.name.endsWith('.html')) {
      const relativePath = path.relative(baseDir, fullPath);
      const extracted = extractFromHTML(fullPath);

      if (extracted.length > 0) {
        results[relativePath] = extracted;
      }
    }
  }

  return results;
}

// Main
console.log('Extracting translatable text from HTML files...\n');

if (!fs.existsSync(SRC_DIR)) {
  console.error(`ERROR: Source directory not found: ${SRC_DIR}`);
  process.exit(1);
}

const results = analyzeDirectory(SRC_DIR);

console.log('='.repeat(80));
console.log('EXTRACTION RESULTS');
console.log('='.repeat(80));

for (const [file, items] of Object.entries(results)) {
  console.log(`\n📄 ${file}`);
  console.log('-'.repeat(80));

  for (const item of items) {
    console.log(`  Line ${item.line} [${item.type}]: ${item.text.substring(0, 80)}${item.text.length > 80 ? '...' : ''}`);
  }
}

console.log('\n' + '='.repeat(80));
console.log(`Total files: ${Object.keys(results).length}`);
console.log(`Total items: ${Object.values(results).reduce((sum, items) => sum + items.length, 0)}`);
console.log('='.repeat(80));
console.log('\nNOTE: This is a suggestion list. Manual review and key assignment needed.');
console.log('Consider organizing keys by section: meta.*, hero.*, nav.*, footer.*, etc.\n');
