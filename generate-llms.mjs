/**
 * generate-llms.mjs — GlobalCampaignHub
 * ──────────────────────────────────────
 * Generates llms.txt for AI crawler discoverability.
 * Lists all merchants, keywords, and blog pages.
 *
 * RUN: node generate-llms.mjs
 */

import { writeFileSync, readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir    = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://brightlane.github.io/GlobalCampaignHub';
const TODAY    = new Date().toISOString().split('T')[0];

const RAW_KEYWORDS = JSON.parse(readFileSync(resolve(__dir, 'keywords-1000.json'), 'utf-8'));

const merchants = {};
for (const kw of RAW_KEYWORDS) {
  const m = kw.merchant.replace(/^gh-/, '');
  if (!merchants[m]) merchants[m] = { cat: kw.cat, lc: kw.lc, keywords: [] };
  merchants[m].keywords.push(kw.keyword);
}

function getPublishedPages() {
  const pages = [];
  const blogDir = resolve(__dir, 'blog', 'en');
  if (!existsSync(blogDir)) return pages;
  try {
    readdirSync(blogDir).forEach(slug => {
      const indexFile = resolve(blogDir, slug, 'index.html');
      if (existsSync(indexFile)) {
        const html  = readFileSync(indexFile, 'utf-8');
        const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || slug;
        const desc  = (html.match(/name="description" content="([^"]+)"/) || [])[1] || '';
        pages.push({ slug, title: title.replace(' | GlobalCampaignHub', ''), desc });
      }
    });
  } catch {}
  return pages;
}

function buildLlms() {
  const pages = getPublishedPages();

  const merchantList = Object.entries(merchants)
    .map(([name, data]) => `- ${name} (${data.cat}): ${BASE_URL}/blog/en/`)
    .join('\n');

  const pageList = pages.length > 0
    ? pages.map(p => `- [${p.title}](${BASE_URL}/blog/en/${p.slug}/) — ${p.desc}`).join('\n')
    : '- No pages published yet';

  const topKeywords = RAW_KEYWORDS.slice(0, 50)
    .map(k => `- ${k.keyword} (vol: ${k.volume.toLocaleString()})`)
    .join('\n');

  const catSummary = {};
  for (const kw of RAW_KEYWORDS) {
    catSummary[kw.cat] = (catSummary[kw.cat] || 0) + 1;
  }
  const catList = Object.entries(catSummary)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => `- ${cat}: ${count} keywords`)
    .join('\n');

  return `# GlobalCampaignHub — AI Crawler Index
# Generated: ${TODAY}
# ${BASE_URL}

## About
GlobalCampaignHub is a comprehensive affiliate marketing hub featuring verified merchants across multiple categories. All affiliate links route through LinkConnector (account 007949).

## Brightlane Affiliate Network
- Business Tools Hub: https://brightlane.github.io/omni-hub/
- Verified Merchant Directory: https://brightlane.github.io/verified-merchant-directory/
- Global Campaign Hub: ${BASE_URL}/

## Site Stats
- Merchants: ${Object.keys(merchants).length}
- Total Keywords: ${RAW_KEYWORDS.length.toLocaleString()}
- Blog Pages (EN): ${pages.length}
- Languages: 100
- Last Updated: ${TODAY}

## Categories
${catList}

## Merchants
${merchantList}

## Published Blog Posts (English)
${pageList}

## Top Keywords by Volume
${topKeywords}

## Technical
- Sitemap: ${BASE_URL}/sitemap.xml
- Robots: ${BASE_URL}/robots.txt
- Affiliate Network: LinkConnector (account 007949)
- Content: SEO-optimized affiliate blog posts in 100 languages
`;
}

const llms = buildLlms();
writeFileSync(resolve(__dir, 'llms.txt'), llms, 'utf-8');
console.log(`✅ llms.txt generated — ${RAW_KEYWORDS.length} keywords, ${Object.keys(merchants).length} merchants`);
