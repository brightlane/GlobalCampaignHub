#!/usr/bin/env node
/**
 * delete-duplicate-posts.js — omni-hub
 * ──────────────────────────────────────
 * Deletes specific duplicate blog post directories across all language folders.
 * Also removes their entries from sitemap.xml.
 *
 * RUN: node delete-duplicate-posts.js
 * DRY RUN: node delete-duplicate-posts.js --dry-run
 */

const fs   = require('fs');
const path = require('path');

const ROOT    = path.resolve(__dirname);
const DRY_RUN = process.argv.includes('--dry-run');

// ── Slugs to delete ────────────────────────────────────────────────────────
const SLUGS_TO_DELETE = [
  'best-hr-software-for-small-business',
  'best-email-marketing-platform-getresponse-review',
];

console.log(`\n🗑  omni-hub Duplicate Post Cleaner`);
console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no deletes)' : 'LIVE'}`);
console.log(`   Slugs to remove: ${SLUGS_TO_DELETE.join(', ')}\n`);

// ── Recursively delete a directory ────────────────────────────────────────
function deleteDir(dirPath) {
  if (!fs.existsSync(dirPath)) return false;
  if (DRY_RUN) {
    console.log(`  [DRY] Would delete: ${dirPath}`);
    return true;
  }
  fs.rmSync(dirPath, { recursive: true, force: true });
  return true;
}

// ── Find all language folders under /blog/ ────────────────────────────────
function getLangFolders() {
  const blogDir = path.join(ROOT, 'blog');
  if (!fs.existsSync(blogDir)) {
    console.error('❌ /blog/ directory not found. Are you in the omni-hub root?');
    process.exit(1);
  }
  return fs.readdirSync(blogDir).filter(f => {
    const fullPath = path.join(blogDir, f);
    return fs.statSync(fullPath).isDirectory();
  });
}

// ── Main delete pass ───────────────────────────────────────────────────────
const langs  = getLangFolders();
console.log(`   Found ${langs.length} language folders\n`);

let totalDeleted = 0;
let totalMissed  = 0;

for (const slug of SLUGS_TO_DELETE) {
  console.log(`📁 Removing: ${slug}`);
  let deleted = 0;

  for (const lang of langs) {
    const dir = path.join(ROOT, 'blog', lang, slug);
    if (deleteDir(dir)) {
      deleted++;
    }
  }

  console.log(`   → ${deleted} language folders ${DRY_RUN ? 'would be' : ''} deleted`);
  if (deleted === 0) {
    console.log(`   ⚠️  Not found in any language folder — already removed?`);
    totalMissed++;
  }
  totalDeleted += deleted;
}

// ── Remove from sitemap.xml ────────────────────────────────────────────────
const sitemapPath = path.join(ROOT, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  let removedFromSitemap = 0;

  for (const slug of SLUGS_TO_DELETE) {
    // Remove entire <url>...</url> blocks containing this slug
    const before = sitemap.length;
    sitemap = sitemap.replace(
      new RegExp(`\\s*<url>[^<]*<loc>[^<]*${slug}[^<]*<\\/loc>[\\s\\S]*?<\\/url>`, 'g'),
      ''
    );
    if (sitemap.length < before) removedFromSitemap++;
  }

  if (!DRY_RUN) {
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  }
  console.log(`\n🗺  sitemap.xml: ${removedFromSitemap} entries ${DRY_RUN ? 'would be' : ''} removed`);
} else {
  console.log('\n⚠️  sitemap.xml not found — skipping');
}

// ── Remove from blog index pages ───────────────────────────────────────────
let indexFixed = 0;
for (const lang of langs) {
  const indexPath = path.join(ROOT, 'blog', lang, 'index.html');
  if (!fs.existsSync(indexPath)) continue;

  let html = fs.readFileSync(indexPath, 'utf8');
  let changed = false;

  for (const slug of SLUGS_TO_DELETE) {
    // Remove any <article> or <a> blocks linking to this slug
    const before = html.length;
    html = html.replace(
      new RegExp(`<article[^>]*>[\\s\\S]*?/${slug}/[\\s\\S]*?<\\/article>`, 'g'),
      ''
    );
    html = html.replace(
      new RegExp(`<a[^>]*/${slug}/[^>]*>[\\s\\S]*?<\\/a>`, 'g'),
      ''
    );
    if (html.length < before) changed = true;
  }

  if (changed) {
    if (!DRY_RUN) fs.writeFileSync(indexPath, html, 'utf8');
    indexFixed++;
  }
}
console.log(`📄 Blog index pages cleaned: ${indexFixed}`);

// ── Summary ────────────────────────────────────────────────────────────────
console.log(`\n✅ Done`);
console.log(`   Directories deleted: ${totalDeleted}`);
console.log(`   Slugs not found:     ${totalMissed}`);
if (DRY_RUN) console.log(`\n   Run without --dry-run to apply changes`);
