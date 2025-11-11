#!/usr/bin/env node

/**
 * Bulk apply translation placeholders to source files
 * This script applies common patterns across multiple files
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

// Define replacements: [pattern, replacement, description]
const REPLACEMENTS = [
  // Header section
  [
    "Romania's Leading PET Manufacturer - Closing the Circular Economy Loop",
    "{{t header.topbarTagline}}",
    "Header topbar tagline"
  ],
  [
    /<option value="ro" selected>Română<\/option>/g,
    '<option value="ro">{{t header.langRomanian}}</option>',
    "Romanian language option"
  ],
  [
    /<option value="en">English<\/option>/g,
    '<option value="en">{{t header.langEnglish}}</option>',
    "English language option"
  ],
  [
    /<li><a href="index\.html">Home<\/a><\/li>/g,
    '<li><a href="index.html">{{t nav.home}}</a></li>',
    "Nav: Home"
  ],
  [
    /<li><a href="#story">Story<\/a><\/li>/g,
    '<li><a href="#story">{{t nav.story}}</a></li>',
    "Nav: Story"
  ],
  [
    /<a href="javascript:void\(0\)">Teams<\/a>/g,
    '<a href="javascript:void(0)">{{t nav.about}}</a>',
    "Nav: Teams"
  ],
  [
    /<a href="javascript:void\(0\)">Products<\/a>/g,
    '<a href="javascript:void(0)">{{t nav.products}}</a>',
    "Nav: Products"
  ],
  [
    /<a href="#certifications">Certifications<\/a>/g,
    '<a href="#certifications">{{t nav.certifications}}</a>',
    "Nav: Certifications"
  ],
  [
    /<li><a href="news\.html">News<\/a><\/li>/g,
    '<li><a href="news.html">{{t nav.news}}</a></li>',
    "Nav: News"
  ],

  // Hero section
  [
    /Closing the Circle: From PET Waste to\s+/g,
    "{{t hero.title}} ",
    "Hero title"
  ],
  [
    /<span class="active-color">Premium Preforms<\/span>/g,
    '<span class="active-color">{{t hero.titleHighlight}}</span>',
    "Hero title highlight"
  ],
  [
    /Leading Romania's circular economy with bottle-to-bottle technology\. Transforming PET waste into high-quality preforms for a sustainable future\./g,
    "{{t hero.subtitle}}",
    "Hero subtitle"
  ],
  [
    /<div class="btn_text">Discover Our Story<\/div>/g,
    '<div class="btn_text">{{t hero.ctaButton}}</div>',
    "Hero CTA button"
  ],
  [
    /<div class="btn_text">Learn More<\/div>/g,
    '<div class="btn_text">{{t common.learnMore}}</div>',
    "Learn More button"
  ],
  [
    /<div class="btn_text">Contact Us<\/div>/g,
    '<div class="btn_text">{{t common.contactUs}}</div>',
    "Contact Us button"
  ],
  [
    /<div class="btn_text">Read More<\/div>/g,
    '<div class="btn_text">{{t common.readMore}}</div>',
    "Read More button"
  ],

  // Story section
  [
    /Integrated bottle-to-bottle technology closing the sustainability loop/g,
    "{{t story.heading}}",
    "Story heading"
  ],

  // Teams section
  [
    /Two integrated teams, one vision/g,
    "{{t teams.heading}}",
    "Teams heading"
  ],

  // Products section
  [
    /Sustainable packaging, vertically integrated\./g,
    "{{t products.heading}}",
    "Products heading"
  ],
  [
    /<h3 class="[^"]*">rPET Flakes<\/h3>/g,
    '<h3 class="$&">{{t products.flakes.title}}</h3>'.replace(/class="[^"]*">.*<\/h3>/g, (m) => m.replace('rPET Flakes', '{{t products.flakes.title}}')),
    "Product: rPET Flakes"
  ],
  [
    /<h3 class="[^"]*">rPET Resin<\/h3>/g,
    '<h3 class="$&">{{t products.resin.title}}</h3>'.replace(/class="[^"]*">.*<\/h3>/g, (m) => m.replace('rPET Resin', '{{t products.resin.title}}')),
    "Product: rPET Resin"
  ],
  [
    /<h3 class="[^"]*">PET Preforms<\/h3>/g,
    '<h3 class="$&">{{t products.preforms.title}}</h3>'.replace(/class="[^"]*">.*<\/h3>/g, (m) => m.replace('PET Preforms', '{{t products.preforms.title}}')),
    "Product: PET Preforms"
  ],

  // Certifications section
  [
    /Quality and compliance standards/g,
    "{{t certifications.heading}}",
    "Certifications heading"
  ],

  // Portfolio section
  [
    /Trusted by Leading Brands/g,
    "{{t portfolio.heading}}",
    "Portfolio heading"
  ],

  // News section
  [
    /Latest News & Updates/g,
    "{{t news.heading}}",
    "News heading"
  ],
  [
    /<h4 class="hamburger-title">Contact<\/h4>/g,
    '<h4 class="hamburger-title">{{t contact.heading}}</h4>',
    "Contact heading"
  ]
];

function applyReplacements(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [pattern, replacement, description] of REPLACEMENTS) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) {
      console.log(`  ✓ Applied: ${description}`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let totalModified = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      totalModified += processDirectory(fullPath);
    } else if (entry.name.endsWith('.html')) {
      const relativePath = path.relative(SRC_DIR, fullPath);
      console.log(`\n📄 Processing: ${relativePath}`);

      if (applyReplacements(fullPath)) {
        totalModified++;
      } else {
        console.log(`  (no changes)`);
      }
    }
  }

  return totalModified;
}

// Main
console.log('Applying translation placeholders...\n');
console.log('='.repeat(80));

const modified = processDirectory(SRC_DIR);

console.log('\n' + '='.repeat(80));
console.log(`✓ Complete! Modified ${modified} files`);
console.log('='.repeat(80));
