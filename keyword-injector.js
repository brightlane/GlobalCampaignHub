#!/usr/bin/env node
/**
 * keyword-injector.js
 * GlobalCampaignHub — Injects English keyword meta-data into all blog HTML files,
 * index.html, and llms.txt. Safe to run repeatedly; same-day runs overwrite.
 *
 * Usage:
 *   node keyword-injector.js              # inject top 300 keywords (default)
 *   node keyword-injector.js --top 500    # inject top 500
 *   node keyword-injector.js --dry-run    # preview only, no writes
 *
 * Requires: keywords-1000.json in same directory
 * Output log: keyword-injector-log.json
 */

const fs   = require('fs');
const path = require('path');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const ROOT        = path.resolve(__dirname);
const KEYWORDS_FILE = path.join(ROOT, 'keywords-1000.json');
const LOG_FILE    = path.join(ROOT, 'keyword-injector-log.json');

const BLOG_FILES = [
  'blog.html',
  'blog-zh.html', 'blog-zh-tw.html',
  'blog-es.html', 'blog-fr.html', 'blog-de.html',
  'blog-pt.html', 'blog-pt-br.html',
  'blog-ja.html', 'blog-ko.html', 'blog-it.html',
  'blog-nl.html', 'blog-pl.html', 'blog-hi.html',
  'blog-ar.html', 'blog-ru.html', 'blog-tr.html',
  'blog-id.html', 'blog-vi.html', 'blog-th.html',
];

// Marker comments injector targets
const MARKER_START = '<!-- KW-DATA:START -->';
const MARKER_END   = '<!-- KW-DATA:END -->';
const LLMS_MARKER  = '## Keywords';

// ── ARG PARSING ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const topArg  = args.indexOf('--top');
const TOP_N   = topArg !== -1 ? parseInt(args[topArg + 1], 10) : 300;

// ── LOAD KEYWORDS ─────────────────────────────────────────────────────────────
if (!fs.existsSync(KEYWORDS_FILE)) {
  console.error('ERROR: keywords-1000.json not found at', KEYWORDS_FILE);
  process.exit(1);
}

const ALL_KEYWORDS = JSON.parse(fs.readFileSync(KEYWORDS_FILE, 'utf8'));
// Already sorted by volume desc in the file; take top N
const TOP_KEYWORDS = ALL_KEYWORDS.slice(0, TOP_N);

console.log(`\n📦 GlobalCampaignHub Keyword Injector`);
console.log(`   Total keywords: ${ALL_KEYWORDS.length}`);
console.log(`   Injecting top: ${TOP_N}`);
console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}\n`);

// ── BUILD INJECTION BLOCK ─────────────────────────────────────────────────────
function buildDataBlock(keywords) {
  const cats = [...new Set(keywords.map(k => k.cat))].sort();
  const merchants = [...new Set(keywords.map(k => k.merchant))].sort();

  const byMerchant = {};
  keywords.forEach(k => {
    if (!byMerchant[k.merchant]) byMerchant[k.merchant] = [];
    byMerchant[k.merchant].push(k.keyword);
  });

  // Compact JSON — one line per keyword for readability
  const kwJson = JSON.stringify(keywords.map(k => ({
    kw: k.keyword,
    vol: k.volume,
    m: k.merchant,
    lc: k.lc,
    cat: k.cat,
    slug: k.slug,
  })));

  const topTerms = keywords.slice(0, 20).map(k => k.keyword).join(', ');

  return `${MARKER_START}
<script id="gh-kw-data" type="application/json">
${kwJson}
</script>
<meta name="keywords" content="${topTerms}">
<!-- Categories: ${cats.join(' | ')} -->
<!-- Merchants: ${merchants.length} | Keywords: ${keywords.length} -->
<!-- Generated: ${new Date().toISOString().split('T')[0]} -->
${MARKER_END}`;
}

// ── INJECT INTO HTML FILE ─────────────────────────────────────────────────────
function injectHtml(filePath, block) {
  if (!fs.existsSync(filePath)) {
    return { status: 'skipped', reason: 'file not found' };
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const hasMarkers = html.includes(MARKER_START);

  if (hasMarkers) {
    // Replace existing block
    const startIdx = html.indexOf(MARKER_START);
    const endIdx   = html.indexOf(MARKER_END) + MARKER_END.length;
    html = html.slice(0, startIdx) + block + html.slice(endIdx);
  } else {
    // Insert before </head>
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${block}\n</head>`);
    } else {
      // Fallback: prepend
      html = block + '\n' + html;
    }
  }

  if (!DRY_RUN) fs.writeFileSync(filePath, html, 'utf8');
  return { status: hasMarkers ? 'updated' : 'inserted', bytes: html.length };
}

// ── INJECT INTO LLMS.TXT ──────────────────────────────────────────────────────
function injectLlms(filePath, keywords) {
  if (!fs.existsSync(filePath)) {
    return { status: 'skipped', reason: 'file not found' };
  }

  let txt = fs.readFileSync(filePath, 'utf8');
  const today = new Date().toISOString().split('T')[0];

  const kwSection = `## Keywords
<!-- Generated: ${today} | Top ${keywords.length} of ${ALL_KEYWORDS.length} -->
${keywords.map(k => `- ${k.keyword} (${k.cat})`).join('\n')}`;

  if (txt.includes(LLMS_MARKER)) {
    // Replace from ## Keywords to next ## or end of file
    const start = txt.indexOf(LLMS_MARKER);
    const nextSection = txt.indexOf('\n## ', start + 4);
    if (nextSection !== -1) {
      txt = txt.slice(0, start) + kwSection + '\n\n' + txt.slice(nextSection + 1);
    } else {
      txt = txt.slice(0, start) + kwSection;
    }
  } else {
    txt = txt.trimEnd() + '\n\n' + kwSection + '\n';
  }

  if (!DRY_RUN) fs.writeFileSync(filePath, txt, 'utf8');
  return { status: 'updated' };
}

// ── BUILD KEYWORD SITEMAP JSON ────────────────────────────────────────────────
function writeKeywordSitemap(keywords) {
  const sitemap = {
    generated: new Date().toISOString(),
    total: keywords.length,
    byCategory: {},
    byMerchant: {},
  };

  keywords.forEach(k => {
    if (!sitemap.byCategory[k.cat]) sitemap.byCategory[k.cat] = [];
    sitemap.byCategory[k.cat].push(k.keyword);
    if (!sitemap.byMerchant[k.merchant]) sitemap.byMerchant[k.merchant] = [];
    sitemap.byMerchant[k.merchant].push(k.keyword);
  });

  const outPath = path.join(ROOT, 'keyword-sitemap.json');
  if (!DRY_RUN) fs.writeFileSync(outPath, JSON.stringify(sitemap, null, 2));
  return outPath;
}

// ── RUN ───────────────────────────────────────────────────────────────────────
const block = buildDataBlock(TOP_KEYWORDS);
const results = {};
let ok = 0, skipped = 0;

// Blog files
for (const fname of BLOG_FILES) {
  const fpath = path.join(ROOT, fname);
  const r = injectHtml(fpath, block);
  results[fname] = r;
  if (r.status === 'skipped') {
    skipped++;
    console.log(`  ⚠  ${fname}: ${r.reason}`);
  } else {
    ok++;
    console.log(`  ✓  ${fname}: ${r.status}`);
  }
}

// index.html
const indexPath = path.join(ROOT, 'index.html');
const ir = injectHtml(indexPath, block);
results['index.html'] = ir;
ir.status === 'skipped'
  ? (skipped++, console.log(`  ⚠  index.html: ${ir.reason}`))
  : (ok++, console.log(`  ✓  index.html: ${ir.status}`));

// llms.txt
const llmsPath = path.join(ROOT, 'llms.txt');
const lr = injectLlms(llmsPath, TOP_KEYWORDS);
results['llms.txt'] = lr;
lr.status === 'skipped'
  ? (skipped++, console.log(`  ⚠  llms.txt: ${lr.reason}`))
  : (ok++, console.log(`  ✓  llms.txt: ${lr.status}`));

// keyword-sitemap.json
const sitemapPath = writeKeywordSitemap(TOP_KEYWORDS);
console.log(`  ✓  keyword-sitemap.json: written`);

// ── LOG ───────────────────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];
let log = {};
if (fs.existsSync(LOG_FILE)) {
  try { log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch(e) {}
}
// Same-day runs overwrite (no stack)
log[today] = {
  timestamp: new Date().toISOString(),
  mode: DRY_RUN ? 'dry-run' : 'live',
  topN: TOP_N,
  totalKeywords: ALL_KEYWORDS.length,
  filesOk: ok,
  filesSkipped: skipped,
  results,
};
if (!DRY_RUN) fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));

console.log(`\n✅ Done — ${ok} files updated, ${skipped} skipped`);
console.log(`📄 Log: keyword-injector-log.json`);
console.log(`🗺  Sitemap: keyword-sitemap.json\n`);
