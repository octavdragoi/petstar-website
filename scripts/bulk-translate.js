#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

// Comprehensive list of text replacements
const replacements = [
  // Header/Topbar
  ["Romania's Leading PET Manufacturer - Closing the Circular Economy Loop", "{{t header.topbarTagline}}"],
  ['<option value="ro" selected>Română</option>', '<option value="ro">{{t header.langRomanian}}</option>'],
  ['<option value="ro">Română</option>', '<option value="ro">{{t header.langRomanian}}</option>'],
  ['<option value="en">English</option>', '<option value="en">{{t header.langEnglish}}</option>'],

  // Navigation
  ['<li><a href="index.html">Home</a></li>', '<li><a href="index.html">{{t nav.home}}</a></li>'],
  ['<li><a href="#story">Story</a></li>', '<li><a href="#story">{{t nav.story}}</a></li>'],
  ['<a href="javascript:void(0)">Teams</a>', '<a href="javascript:void(0)">{{t nav.about}}</a>'],
  ['<a href="javascript:void(0)">Products</a>', '<a href="javascript:void(0)">{{t nav.products}}</a>'],
  ['<a href="#certifications">Certifications</a>', '<a href="#certifications">{{t nav.certifications}}</a>'],
  ['<li><a href="news.html">News</a></li>', '<li><a href="news.html">{{t nav.news}}</a></li>'],
  ['<li><a href="contact.html">Contact</a></li>', '<li><a href="contact.html">{{t nav.contact}}</a></li>'],

  // Buttons
  ['<span>Contact Us</span>', '<span>{{t common.contactUs}}</span>'],
  ['<span>Get Quote</span>', '<span>{{t common.getInTouch}}</span>'],
  ['<span>Learn More</span>', '<span>{{t common.learnMore}}</span>'],
  ['<span>Read More</span>', '<span>{{t common.readMore}}</span>'],
  ['<span>View More</span>', '<span>{{t common.viewMore}}</span>'],
  ['Menu\n', '{{t header.menu}}\n'],

  // Story section
  ['Integrated bottle-to-bottle technology closing the sustainability loop', '{{t story.heading}}'],

  // Teams section
  ['Two integrated teams, one vision', '{{t teams.heading}}'],

  // Products section
  ['Sustainable packaging, vertically integrated.', '{{t products.heading}}'],

  // Certifications
  ['Quality and compliance standards', '{{t certifications.heading}}'],

  // Portfolio
  ['Trusted by Leading Brands', '{{t portfolio.heading}}'],

  // News
  ['Latest News & Updates', '{{t news.heading}}'],
  ['<h4 class="hamburger-title">Contact</h4>', '<h4 class="hamburger-title">{{t contact.heading}}</h4>'],
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.replaceAll(search, replace);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function processDir(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += processDir(fullPath);
    } else if (entry.name.endsWith('.html')) {
      if (replaceInFile(fullPath)) {
        console.log(`✓ ${path.relative(SRC_DIR, fullPath)}`);
        count++;
      }
    }
  }
  return count;
}

console.log('Applying bulk translations...\n');
const modified = processDir(SRC_DIR);
console.log(`\n✓ Modified ${modified} files`);
