/**
 * generate-sitemaps.mjs — GlobalCampaignHub
 * ─────────────────────────────────────────
 * Crawls /blog/ directory tree, builds sitemap.xml,
 * pings IndexNow + Google, and updates robots.txt.
 *
 * RUN: node generate-sitemaps.mjs
 */

import { writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir        = dirname(fileURLToPath(import.meta.url));
const BASE_URL     = 'https://brightlane.github.io/GlobalCampaignHub';
const TODAY        = new Date().toISOString().split('T')[0];
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';

function crawlBlogPages() {
  const urls = [];
  const blogDir = resolve(__dir, 'blog');
  if (!existsSync(blogDir)) return urls;

  function walk(dir) {
    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const fullPath = resolve(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (entry === 'index.html') {
          const rel = fullPath
            .replace(__dir, '')
            .replace(/\\/g, '/')
            .replace('/index.html', '/');
          urls.push(rel);
        }
      }
    } catch {}
  }

  walk(blogDir);
  return urls;
}

function buildSitemap(blogUrls) {
  const staticPages = [
    { url: '/',      priority: '1.0', changefreq: 'daily' },
    { url: '/blog/', priority: '0.9', changefreq: 'daily' },
  ];

  const blogEntries = blogUrls.map(rel => ({
    url: rel,
    priority: rel.includes('/en/') ? '0.9' : '0.7',
    changefreq: 'weekly',
  }));

  const allPages = [...staticPages, ...blogEntries];

  const urlset = allPages.map(p => `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlset}
</urlset>`;
}

async function pingIndexNow(urls) {
  if (!INDEXNOW_KEY) {
    console.log('⚠️  No INDEXNOW_KEY — skipping IndexNow ping');
    return;
  }
  const fullUrls = urls.slice(0, 10000).map(u => `${BASE_URL}${u}`);
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'brightlane.github.io',
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: fullUrls,
      }),
    });
    console.log(`🔔 IndexNow ping: ${res.status} — ${fullUrls.length} URLs submitted`);
  } catch (err) {
    console.warn(`⚠️  IndexNow ping failed: ${err.message}`);
  }
}

async function pingGoogle() {
  try {
    const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
    const res = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
    console.log(`🔔 Google ping: ${res.status}`);
  } catch (err) {
    console.warn(`⚠️  Google ping failed: ${err.message}`);
  }
}

function updateRobots() {
  const content = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n\n# GlobalCampaignHub — Brightlane Affiliate Network\n# Generated: ${TODAY}\n`;
  writeFileSync(resolve(__dir, 'robots.txt'), content, 'utf-8');
  console.log('📄 robots.txt updated');
}

async function main() {
  console.log('🗺  GlobalCampaignHub Sitemap Generator');
  const blogUrls = crawlBlogPages();
  console.log(`   Found ${blogUrls.length} blog pages`);

  const sitemap = buildSitemap(blogUrls);
  writeFileSync(resolve(__dir, 'sitemap.xml'), sitemap, 'utf-8');
  console.log(`✅ sitemap.xml written — ${blogUrls.length + 2} URLs`);

  updateRobots();

  const allUrls = ['/', '/blog/', ...blogUrls];
  await pingIndexNow(allUrls);
  await pingGoogle();

  console.log('🎉 Sitemap generation complete');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(0);
});
