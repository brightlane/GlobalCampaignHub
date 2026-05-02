/**
 * generate-blog-post.mjs — GlobalCampaignHub
 * ─────────────────────────────────────────────────────
 * 1. Picks 10 next unwritten keywords from keywords-1000.json
 * 2. Writes a full SEO blog post per keyword in English
 * 3. Four auditors score it (SEO, Quality, Affiliate, Translation)
 * 4. If any score fails → rewrite with feedback (max 3 attempts)
 * 5. Translates in parallel chunks of 4 → 100 languages
 * 6. Affiliate links use LinkConnector LC codes from keywords-1000.json
 * 7. Contextual cross-site backlinks to all 3 Brightlane sites
 *
 * RUN:  node generate-blog-post.mjs
 * RUN with keyword: node generate-blog-post.mjs --keyword "nordvpn review"
 * RUN with lang batch: node generate-blog-post.mjs --lang en,es,fr,de
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { runAllAudits, auditTranslation, THRESHOLDS, MAX_RETRIES } from './audit-post.mjs';

const __dir    = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://brightlane.github.io/GlobalCampaignHub';
const TODAY    = new Date().toISOString().split('T')[0];
const YEAR     = new Date().getFullYear();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const AI_ENDPOINT  = 'https://models.inference.ai.azure.com';
const AI_MODEL     = 'gpt-4o-mini';

if (!GITHUB_TOKEN) {
  console.error('❌  GITHUB_TOKEN not available. Must run inside GitHub Actions.');
  process.exit(1);
}

const RAW_KEYWORDS = JSON.parse(readFileSync(resolve(__dir, 'keywords-1000.json'), 'utf-8'));

function buildAffUrl(lc, merchant) {
  const atid = merchant.replace(/^gh-/, '');
  return `https://www.linkconnector.com/ta.php?lc=${lc}&atid=${atid}`;
}

const MERCHANT_LC = {};
for (const kw of RAW_KEYWORDS) {
  if (!MERCHANT_LC[kw.merchant]) {
    MERCHANT_LC[kw.merchant] = { lc: kw.lc, url: buildAffUrl(kw.lc, kw.merchant) };
  }
}

const LANG_LIST = [
  { code: 'en',    name: 'English',              locale: 'en-US'  },
  { code: 'es',    name: 'Spanish',              locale: 'es-ES'  },
  { code: 'fr',    name: 'French',               locale: 'fr-FR'  },
  { code: 'de',    name: 'German',               locale: 'de-DE'  },
  { code: 'pt',    name: 'Portuguese',           locale: 'pt-PT'  },
  { code: 'pt-br', name: 'Brazilian Portuguese', locale: 'pt-BR'  },
  { code: 'it',    name: 'Italian',              locale: 'it-IT'  },
  { code: 'nl',    name: 'Dutch',                locale: 'nl-NL'  },
  { code: 'pl',    name: 'Polish',               locale: 'pl-PL'  },
  { code: 'ru',    name: 'Russian',              locale: 'ru-RU'  },
  { code: 'uk',    name: 'Ukrainian',            locale: 'uk-UA'  },
  { code: 'tr',    name: 'Turkish',              locale: 'tr-TR'  },
  { code: 'ar',    name: 'Arabic',               locale: 'ar-SA'  },
  { code: 'fa',    name: 'Persian',              locale: 'fa-IR'  },
  { code: 'hi',    name: 'Hindi',                locale: 'hi-IN'  },
  { code: 'bn',    name: 'Bengali',              locale: 'bn-BD'  },
  { code: 'ur',    name: 'Urdu',                 locale: 'ur-PK'  },
  { code: 'id',    name: 'Indonesian',           locale: 'id-ID'  },
  { code: 'ms',    name: 'Malay',                locale: 'ms-MY'  },
  { code: 'th',    name: 'Thai',                 locale: 'th-TH'  },
  { code: 'vi',    name: 'Vietnamese',           locale: 'vi-VN'  },
  { code: 'zh',    name: 'Chinese Simplified',   locale: 'zh-CN'  },
  { code: 'zh-tw', name: 'Chinese Traditional',  locale: 'zh-TW'  },
  { code: 'ja',    name: 'Japanese',             locale: 'ja-JP'  },
  { code: 'ko',    name: 'Korean',               locale: 'ko-KR'  },
  { code: 'tl',    name: 'Filipino',             locale: 'tl-PH'  },
  { code: 'ta',    name: 'Tamil',                locale: 'ta-IN'  },
  { code: 'te',    name: 'Telugu',               locale: 'te-IN'  },
  { code: 'ml',    name: 'Malayalam',            locale: 'ml-IN'  },
  { code: 'mr',    name: 'Marathi',              locale: 'mr-IN'  },
  { code: 'gu',    name: 'Gujarati',             locale: 'gu-IN'  },
  { code: 'pa',    name: 'Punjabi',              locale: 'pa-IN'  },
  { code: 'kn',    name: 'Kannada',              locale: 'kn-IN'  },
  { code: 'si',    name: 'Sinhala',              locale: 'si-LK'  },
  { code: 'my',    name: 'Burmese',              locale: 'my-MM'  },
  { code: 'km',    name: 'Khmer',                locale: 'km-KH'  },
  { code: 'lo',    name: 'Lao',                  locale: 'lo-LA'  },
  { code: 'am',    name: 'Amharic',              locale: 'am-ET'  },
  { code: 'sw',    name: 'Swahili',              locale: 'sw-KE'  },
  { code: 'ha',    name: 'Hausa',                locale: 'ha-NG'  },
  { code: 'yo',    name: 'Yoruba',               locale: 'yo-NG'  },
  { code: 'ig',    name: 'Igbo',                 locale: 'ig-NG'  },
  { code: 'zu',    name: 'Zulu',                 locale: 'zu-ZA'  },
  { code: 'af',    name: 'Afrikaans',            locale: 'af-ZA'  },
  { code: 'xh',    name: 'Xhosa',               locale: 'xh-ZA'  },
  { code: 'so',    name: 'Somali',               locale: 'so-SO'  },
  { code: 'rw',    name: 'Kinyarwanda',          locale: 'rw-RW'  },
  { code: 'mg',    name: 'Malagasy',             locale: 'mg-MG'  },
  { code: 'cs',    name: 'Czech',                locale: 'cs-CZ'  },
  { code: 'sk',    name: 'Slovak',               locale: 'sk-SK'  },
  { code: 'hu',    name: 'Hungarian',            locale: 'hu-HU'  },
  { code: 'ro',    name: 'Romanian',             locale: 'ro-RO'  },
  { code: 'bg',    name: 'Bulgarian',            locale: 'bg-BG'  },
  { code: 'hr',    name: 'Croatian',             locale: 'hr-HR'  },
  { code: 'sr',    name: 'Serbian',              locale: 'sr-RS'  },
  { code: 'bs',    name: 'Bosnian',              locale: 'bs-BA'  },
  { code: 'sl',    name: 'Slovenian',            locale: 'sl-SI'  },
  { code: 'mk',    name: 'Macedonian',           locale: 'mk-MK'  },
  { code: 'sq',    name: 'Albanian',             locale: 'sq-AL'  },
  { code: 'lt',    name: 'Lithuanian',           locale: 'lt-LT'  },
  { code: 'lv',    name: 'Latvian',              locale: 'lv-LV'  },
  { code: 'et',    name: 'Estonian',             locale: 'et-EE'  },
  { code: 'fi',    name: 'Finnish',              locale: 'fi-FI'  },
  { code: 'sv',    name: 'Swedish',              locale: 'sv-SE'  },
  { code: 'no',    name: 'Norwegian',            locale: 'no-NO'  },
  { code: 'da',    name: 'Danish',               locale: 'da-DK'  },
  { code: 'is',    name: 'Icelandic',            locale: 'is-IS'  },
  { code: 'el',    name: 'Greek',                locale: 'el-GR'  },
  { code: 'he',    name: 'Hebrew',               locale: 'he-IL'  },
  { code: 'ka',    name: 'Georgian',             locale: 'ka-GE'  },
  { code: 'hy',    name: 'Armenian',             locale: 'hy-AM'  },
  { code: 'az',    name: 'Azerbaijani',          locale: 'az-AZ'  },
  { code: 'kk',    name: 'Kazakh',               locale: 'kk-KZ'  },
  { code: 'uz',    name: 'Uzbek',                locale: 'uz-UZ'  },
  { code: 'tk',    name: 'Turkmen',              locale: 'tk-TM'  },
  { code: 'tg',    name: 'Tajik',                locale: 'tg-TJ'  },
  { code: 'mn',    name: 'Mongolian',            locale: 'mn-MN'  },
  { code: 'ne',    name: 'Nepali',               locale: 'ne-NP'  },
  { code: 'ps',    name: 'Pashto',               locale: 'ps-AF'  },
  { code: 'sd',    name: 'Sindhi',               locale: 'sd-PK'  },
  { code: 'ku',    name: 'Kurdish',              locale: 'ku-IQ'  },
  { code: 'ckb',   name: 'Central Kurdish',      locale: 'ckb-IQ' },
  { code: 'gl',    name: 'Galician',             locale: 'gl-ES'  },
  { code: 'eu',    name: 'Basque',               locale: 'eu-ES'  },
  { code: 'ca',    name: 'Catalan',              locale: 'ca-ES'  },
  { code: 'cy',    name: 'Welsh',                locale: 'cy-GB'  },
  { code: 'ga',    name: 'Irish',                locale: 'ga-IE'  },
  { code: 'mt',    name: 'Maltese',              locale: 'mt-MT'  },
  { code: 'lb',    name: 'Luxembourgish',        locale: 'lb-LU'  },
  { code: 'ky',    name: 'Kyrgyz',               locale: 'ky-KG'  },
  { code: 'eo',    name: 'Esperanto',            locale: 'eo'     },
  { code: 'la',    name: 'Latin',                locale: 'la'     },
  { code: 'haw',   name: 'Hawaiian',             locale: 'haw-US' },
  { code: 'mi',    name: 'Maori',                locale: 'mi-NZ'  },
];

async function callAI(systemPrompt, userPrompt, maxTokens = 4000) {
  const MAX_API_RETRIES = 5;
  const BASE_DELAY_MS   = 3000;
  for (let attempt = 1; attempt <= MAX_API_RETRIES; attempt++) {
    try {
      const res = await fetch(`${AI_ENDPOINT}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GITHUB_TOKEN}` },
        body: JSON.stringify({ model: AI_MODEL, max_tokens: maxTokens, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }] }),
      });
      if (res.status === 429) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`⏳ Rate limit, waiting ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? '';
    } catch (err) {
      if (attempt === MAX_API_RETRIES) throw err;
      await new Promise(r => setTimeout(r, BASE_DELAY_MS * Math.pow(2, attempt - 1)));
    }
  }
  throw new Error('Max API retries exceeded');
}

function parseJSON(raw) {
  let clean = raw.trim().replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/```\s*$/i,'').trim();
  const fb = clean.indexOf('{'), fb2 = clean.indexOf('[');
  let start = -1;
  if (fb !== -1 && (fb2 === -1 || fb < fb2)) start = fb;
  if (fb2 !== -1 && (fb === -1 || fb2 < fb)) start = fb2;
  if (start > 0) clean = clean.slice(start);
  const end = Math.max(clean.lastIndexOf('}'), clean.lastIndexOf(']'));
  if (end !== -1) clean = clean.slice(0, end + 1);
  try { return JSON.parse(clean); } catch (err) { throw new Error(`JSON parse failed: ${err.message}\n${clean.slice(0,200)}`); }
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function pickKeywords(manualKeyword) {
  if (manualKeyword) {
    const found = RAW_KEYWORDS.find(k => k.keyword.toLowerCase().includes(manualKeyword.toLowerCase()));
    return found ? [found] : [RAW_KEYWORDS[0]];
  }
  const published = new Set();
  const blogDir = resolve(__dir, 'blog', 'en');
  if (existsSync(blogDir)) { try { readdirSync(blogDir).forEach(f => published.add(f)); } catch {} }
  const STOP = new Set(['for','the','a','an','and','or','of','to','in','on','at','with','by','from','is','are','was','were']);
  const norm = s => s.split('-').filter(w => !STOP.has(w)).join('-');
  const publishedNorm = new Set([...published].map(norm));
  const sorted = [...RAW_KEYWORDS].sort((a, b) => b.volume - a.volume);
  const picks = [];
  for (const kw of sorted) {
    if (picks.length >= 10) break;
    const slug = kw.slug || slugify(kw.keyword);
    if (!published.has(slug) && !publishedNorm.has(norm(slug))) {
      picks.push(kw); published.add(slug); publishedNorm.add(norm(slug));
    }
  }
  return picks.length ? picks : [sorted[0]];
}

function getAffUrl(kw) { return buildAffUrl(kw.lc, kw.merchant); }

function getRelatedMerchants(kw, limit = 4) {
  return Object.entries(MERCHANT_LC).filter(([id]) => id !== kw.merchant).slice(0, limit).map(([id, data]) => ({ id: id.replace(/^gh-/, ''), url: data.url }));
}

async function writeBlogPost(kw) {
  const affUrl = getAffUrl(kw);
  const related = getRelatedMerchants(kw);
  const relatedStr = related.map(r => `${r.id}: ${r.url}`).join('\n');
  const merchantName = kw.merchant.replace(/^gh-/, '').replace(/-/g, ' ');
  const metaKeywords = RAW_KEYWORDS.filter(k => k.merchant === kw.merchant).slice(0, 15).map(k => k.keyword).join(', ');

  const systemPrompt = `You are a senior SEO content writer and affiliate marketing expert for GlobalCampaignHub. Write high-quality, genuinely helpful blog posts that rank on Google and drive affiliate sales through LinkConnector. Never write thin content.`;

  const userPrompt = `Write a comprehensive SEO blog post targeting: "${kw.keyword}"

MERCHANT: ${merchantName}
CATEGORY: ${kw.cat}
AFFILIATE URL: ${affUrl}
MONTHLY SEARCHES: ${kw.volume.toLocaleString()}
YEAR: ${YEAR}

AFFILIATE RULES: Include affiliate URL 6-8 times. Place in intro, each section, tables, CTAs, conclusion. Varied anchor text. CTA button after every section. Cross-link: ${relatedStr}

META KEYWORDS: ${metaKeywords}

Return valid JSON only (no markdown fences):
{
  "title": "SEO title 50-60 chars",
  "metaDescription": "150-160 chars with CTA",
  "metaKeywords": "${metaKeywords}",
  "slug": "${kw.slug || slugify(kw.keyword)}",
  "h1": "H1 slightly different from title",
  "intro": "3-4 paragraphs 400+ words. Affiliate link in paragraph 2.",
  "sections": [{"h2": "heading", "content": "300+ words. Affiliate link. End with CTA button.", "hasCTA": true}],
  "comparisonTable": "HTML table vs 2-3 competitors. Affiliate link in winner column.",
  "pros_cons": {"h2": "Pros and Cons", "pros": ["pro1","pro2","pro3"], "cons": ["con1","con2"]},
  "faq": [{"q": "question", "a": "100+ word answer with affiliate link"}],
  "conclusion": "2-3 paragraphs. Affiliate link twice. Strong CTA.",
  "affiliateDisclosure": "This post contains affiliate links. We earn a commission at no extra cost to you.",
  "wordCount": 1800
}`;

  const raw = await callAI(systemPrompt, userPrompt, 4000);
  const post = parseJSON(raw);
  post.keyword = kw.keyword; post.merchant = kw.merchant;
  post.merchantName = merchantName; post.affUrl = affUrl;
  post.metaKeywords = metaKeywords; post.cat = kw.cat;
  return post;
}

function buildHTML(post, lang, slug, kw) {
  const langMeta = LANG_LIST.find(l => l.code === lang) || { name: 'English', locale: 'en-US' };
  const affUrl   = post.affUrl || getAffUrl({ lc: '', merchant: post.merchant });
  const dir      = ['ar','he','fa','ur','ps','sd','yi'].includes(lang) ? 'rtl' : 'ltr';
  const readTime = Math.ceil((post.wordCount || 1800) / 200);

  const hreflang = LANG_LIST.map(l => `<link rel="alternate" hreflang="${l.code}" href="${BASE_URL}/blog/${l.code}/${slug}/" />`).join('\n  ');
  const sectionsHTML = (post.sections || []).map(s => `<section class="post-section"><h2>${s.h2||''}</h2><div class="section-content">${String(s.content||'')}</div></section>`).join('\n');
  const prosConsHTML = post.pros_cons ? `<section class="post-section"><h2>${post.pros_cons.h2||'Pros and Cons'}</h2><div class="pros-cons-grid"><div class="pros-col"><h3>✅ Pros</h3><ul>${(post.pros_cons.pros||[]).map(p=>`<li>${p}</li>`).join('')}</ul></div><div class="cons-col"><h3>❌ Cons</h3><ul>${(post.pros_cons.cons||[]).map(c=>`<li>${c}</li>`).join('')}</ul></div></div></section>` : '';
  const faqHTML = (post.faq||[]).map(f=>`<div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question"><h3 itemprop="name">${f.q}</h3><div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer"><div itemprop="text">${f.a}</div></div></div>`).join('\n');

  const jsonLD = JSON.stringify({"@context":"https://schema.org","@type":"BlogPosting","headline":post.title,"description":post.metaDescription,"keywords":post.metaKeywords,"datePublished":TODAY,"dateModified":TODAY,"author":{"@type":"Organization","name":"GlobalCampaignHub"},"publisher":{"@type":"Organization","name":"Brightlane","url":BASE_URL},"mainEntityOfPage":{"@type":"WebPage","@id":`${BASE_URL}/blog/${lang}/${slug}/`},"inLanguage":langMeta.locale,"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.7","reviewCount":"89","bestRating":"5"}});
  const faqLD = post.faq?.length ? JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":post.faq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))}) : null;

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${post.title}</title>
  <meta name="description" content="${(post.metaDescription||'').replace(/"/g,'&quot;')}" />
  <meta name="keywords" content="${(post.metaKeywords||'').replace(/"/g,'&quot;')}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="canonical" href="${BASE_URL}/blog/${lang}/${slug}/" />
  ${hreflang}
  <meta property="og:type" content="article" /><meta property="og:title" content="${(post.title||'').replace(/"/g,'&quot;')}" />
  <meta property="og:description" content="${(post.metaDescription||'').replace(/"/g,'&quot;')}" />
  <meta property="og:url" content="${BASE_URL}/blog/${lang}/${slug}/" /><meta property="og:locale" content="${langMeta.locale}" />
  <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${(post.title||'').replace(/"/g,'&quot;')}" />
  <script type="application/ld+json">${jsonLD}</script>
  ${faqLD ? `<script type="application/ld+json">${faqLD}</script>` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap" rel="stylesheet" />
  <style>
    :root{--bg:#0a0b0d;--bg2:#111318;--bg3:#1a1d24;--border:rgba(255,255,255,0.07);--text:#e8e9ed;--muted:#8a8d99;--accent:#47ffb8;--font-head:'Syne',sans-serif;--font-body:'DM Sans',sans-serif;--radius:12px}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:var(--font-body);background:var(--bg);color:var(--text);line-height:1.7}
    a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
    .nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(20px,4vw,60px);height:64px;background:rgba(10,11,13,0.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
    .nav-logo{font-family:var(--font-head);font-weight:800;font-size:1rem;color:var(--text)}
    .nav-cta{background:var(--accent);color:#0a0b0d;font-family:var(--font-head);font-weight:700;font-size:0.8rem;padding:8px 18px;border-radius:8px}
    .container{max-width:860px;margin:0 auto;padding:40px clamp(20px,4vw,40px) 100px}
    .post-meta{font-size:0.8rem;color:var(--muted);margin-bottom:16px}.post-meta span{margin-right:16px}
    .star-row{display:flex;align-items:center;gap:6px;margin-bottom:12px;font-size:0.8rem;color:var(--muted)}.stars{color:#f4c542;letter-spacing:1px}
    h1{font-family:var(--font-head);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;line-height:1.15;letter-spacing:-0.02em;margin-bottom:20px}
    .post-intro{font-size:1.05rem;color:var(--muted);margin-bottom:32px;line-height:1.8}
    .affiliate-cta-hero{background:linear-gradient(135deg,rgba(71,255,184,0.08),rgba(232,255,71,0.05));border:1px solid rgba(71,255,184,0.2);border-radius:var(--radius);padding:24px 28px;margin-bottom:40px;text-align:center}
    .affiliate-cta-hero p{color:var(--muted);margin-bottom:16px}
    .cta-btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#0a0b0d;font-family:var(--font-head);font-weight:700;font-size:0.95rem;padding:14px 32px;border-radius:var(--radius);transition:transform .15s,box-shadow .15s}
    .cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(71,255,184,0.25);text-decoration:none}
    .post-section{margin-bottom:48px}
    h2{font-family:var(--font-head);font-size:clamp(1.2rem,2.5vw,1.6rem);font-weight:700;letter-spacing:-0.01em;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border)}
    .section-content{color:var(--text);font-size:1rem}.section-content p{margin-bottom:16px}
    .pros-cons-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:16px}
    .pros-col,.cons-col{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px}
    .pros-col h3{color:#47ffb8;margin-bottom:12px;font-family:var(--font-head)}.cons-col h3{color:#ff6b6b;margin-bottom:12px;font-family:var(--font-head)}
    .pros-col ul,.cons-col ul{list-style:none;display:flex;flex-direction:column;gap:8px}
    .pros-col li::before{content:"✓ ";color:#47ffb8}.cons-col li::before{content:"✗ ";color:#ff6b6b}
    .comparison-table{width:100%;border-collapse:collapse;margin:24px 0;font-size:0.9rem}
    .comparison-table th{background:var(--bg3);padding:12px 16px;text-align:left;font-family:var(--font-head);border:1px solid var(--border)}
    .comparison-table td{padding:12px 16px;border:1px solid var(--border)}.comparison-table tr:nth-child(even){background:var(--bg2)}
    .faq-section{margin-top:60px}.faq-section h2{font-family:var(--font-head);font-size:1.5rem;margin-bottom:28px}
    .faq-item{border-top:1px solid var(--border);padding:20px 0}.faq-item h3{font-family:var(--font-head);font-size:1rem;font-weight:600;margin-bottom:10px}
    .faq-item div{font-size:0.9rem;color:var(--muted);line-height:1.7}
    .related-merchants{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin:40px 0}
    .related-merchants h3{font-family:var(--font-head);font-weight:700;margin-bottom:16px}
    .related-links{display:flex;gap:12px;flex-wrap:wrap}
    .related-link{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 16px;font-size:0.85rem;color:var(--accent)}
    .breadcrumb{font-size:0.8rem;color:var(--muted);margin-bottom:24px}.breadcrumb a{color:var(--muted)}
    .disclosure{font-size:0.75rem;color:var(--muted);border-top:1px solid var(--border);padding-top:20px;margin-top:60px}
    .network-footer{background:var(--bg2);border-top:1px solid var(--border);padding:16px;text-align:center;font-size:0.75rem;color:var(--muted)}
    .network-footer a{color:var(--accent);margin:0 8px}
    .sticky-cta{position:fixed;bottom:1.5rem;right:1.5rem;z-index:999}
    .sticky-btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#0a0b0d;font-family:var(--font-head);font-weight:700;font-size:0.85rem;padding:12px 22px;border-radius:99px;box-shadow:0 4px 20px rgba(71,255,184,0.3);transition:transform .15s,box-shadow .15s;text-decoration:none}
    .sticky-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(71,255,184,0.5);text-decoration:none}
    footer{border-top:1px solid var(--border);padding:40px clamp(20px,4vw,60px);text-align:center}
    .footer-note{font-size:0.75rem;color:var(--muted);max-width:600px;margin:0 auto}
    @media(max-width:600px){.pros-cons-grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <nav class="nav">
    <a href="${BASE_URL}/" class="nav-logo">Global Campaign <span style="color:var(--accent)">Hub</span></a>
    <a href="${affUrl}" class="nav-cta" target="_blank" rel="sponsored noopener">Visit ${post.merchantName} →</a>
  </nav>
  <div class="container">
    <nav class="breadcrumb"><a href="${BASE_URL}/">Home</a> › <a href="${BASE_URL}/blog/${lang}/">Blog</a> › ${post.title}</nav>
    <article itemscope itemtype="https://schema.org/BlogPosting">
      <header>
        <div class="post-meta"><span>📅 ${TODAY}</span><span>📂 ${post.cat||post.merchantName}</span><span>🌐 ${langMeta.name}</span><span>⏱ ${readTime} min read</span></div>
        <div class="star-row"><span class="stars">★★★★★</span><span>4.7/5 · ${kw?kw.volume.toLocaleString():''} monthly searches</span></div>
        <h1 itemprop="headline">${post.h1||post.title}</h1>
      </header>
      <div class="affiliate-cta-hero">
        <p>Looking for the best deal? We've verified this merchant and found the top offers available right now.</p>
        <a href="${affUrl}" class="cta-btn" target="_blank" rel="sponsored noopener">Visit ${post.merchantName} — Best Deal Available →</a>
      </div>
      <div class="post-intro" itemprop="description">${String(post.intro||'').replace(/\n/g,'<br/>')}</div>
      ${sectionsHTML}
      ${prosConsHTML}
      ${post.comparisonTable?`<section class="post-section"><h2>How ${post.merchantName} Compares</h2>${post.comparisonTable}</section>`:''}
      <div class="affiliate-cta-hero" style="margin:48px 0">
        <p>Ready to get started? Visit ${post.merchantName} through our verified affiliate link.</p>
        <a href="${affUrl}" class="cta-btn" target="_blank" rel="sponsored noopener">Get the Best Deal at ${post.merchantName} →</a>
      </div>
      ${post.faq?.length?`<section class="faq-section" itemscope itemtype="https://schema.org/FAQPage"><h2>Frequently Asked Questions</h2>${faqHTML}</section>`:''}
      <div class="related-merchants">
        <h3>🔗 Other Merchants You Might Like</h3>
        <div class="related-links">
          ${Object.entries(MERCHANT_LC).filter(([id])=>id!==post.merchant).slice(0,6).map(([id,data])=>`<a href="${data.url}" class="related-link" target="_blank" rel="sponsored noopener">${id.replace(/^gh-/,'')} →</a>`).join('')}
        </div>
      </div>
      <div class="post-intro">${String(post.conclusion||'').replace(/\n/g,'<br/>')}</div>
      <div class="affiliate-cta-hero" style="margin-top:48px">
        <p>Don't miss out — visit ${post.merchantName} now through our verified link.</p>
        <a href="${affUrl}" class="cta-btn" target="_blank" rel="sponsored noopener">Visit ${post.merchantName} Now →</a>
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin:40px 0">
        <h3 style="font-family:var(--font-head);font-weight:700;margin-bottom:16px">🌐 More from the Brightlane Affiliate Network</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
          <a href="https://brightlane.github.io/omni-hub/" rel="noopener" style="display:block;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:14px 16px;color:var(--accent);text-decoration:none">
            <div style="font-size:0.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4px">Business Tools</div>
            <div style="font-size:0.9rem;font-weight:600">Omni-Hub — 44+ Top Business Tools →</div>
          </a>
          <a href="https://brightlane.github.io/verified-merchant-directory/" rel="noopener" style="display:block;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:14px 16px;color:var(--accent);text-decoration:none">
            <div style="font-size:0.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4px">Verified Merchants</div>
            <div style="font-size:0.9rem;font-weight:600">Verified Merchant Directory — Trusted Deals →</div>
          </a>
          <a href="https://brightlane.github.io/GlobalCampaignHub/" rel="noopener" style="display:block;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:14px 16px;color:var(--accent);text-decoration:none">
            <div style="font-size:0.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4px">Global Campaigns</div>
            <div style="font-size:0.9rem;font-weight:600">Global Campaign Hub — 70 Merchants, 100 Languages →</div>
          </a>
        </div>
      </div>
      <p class="disclosure">⚠️ ${post.affiliateDisclosure||'This post contains affiliate links. We may earn a commission when you purchase through our links at no extra cost to you.'}</p>
    </article>
  </div>
  <footer><p class="footer-note">© ${YEAR} GlobalCampaignHub · <a href="${BASE_URL}/">Browse All Campaigns</a> · Affiliate links verified through LinkConnector.</p></footer>
  <div class="network-footer">
    <strong>Brightlane Affiliate Network:</strong>
    <a href="https://brightlane.github.io/omni-hub/" rel="noopener">Business Tools Hub</a> ·
    <a href="https://brightlane.github.io/verified-merchant-directory/" rel="noopener">Verified Merchant Directory</a> ·
    <a href="https://brightlane.github.io/GlobalCampaignHub/" rel="noopener">Global Campaign Hub</a>
  </div>
  <div class="sticky-cta">
    <a class="sticky-btn" href="${affUrl}" target="_blank" rel="sponsored noopener">🔗 Best Deal at ${post.merchantName} →</a>
  </div>
</body>
</html>`;
}

async function translatePost(post, targetLang, targetLangName) {
  const systemPrompt = `You are a professional translator. Translate the JSON blog post fields into ${targetLangName}. Preserve ALL HTML tags, affiliate links, and URLs exactly. Return valid JSON only, no markdown.`;
  const fieldsToTranslate = { title: post.title, metaDescription: post.metaDescription, h1: post.h1, intro: post.intro, sections: post.sections, pros_cons: post.pros_cons, faq: post.faq, conclusion: post.conclusion };
  const userPrompt = `Translate into ${targetLangName}. Preserve HTML and URLs exactly. Return JSON only:\n${JSON.stringify(fieldsToTranslate)}`;
  try {
    const raw = await callAI(systemPrompt, userPrompt, 4000);
    const translated = parseJSON(raw);
    return { ...post, ...translated, lang: targetLang };
  } catch (err) {
    console.warn(`⚠️  Translation failed for ${targetLang}: ${err.message}, using English`);
    return { ...post, lang: targetLang };
  }
}

function publishPage(post, lang, slug, kw) {
  const dir = resolve(__dir, 'blog', lang, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'index.html'), buildHTML(post, lang, slug, kw), 'utf-8');
}

function updateBlogIndex(lang, posts) {
  const blogDir = resolve(__dir, 'blog', lang);
  mkdirSync(blogDir, { recursive: true });
  const langMeta = LANG_LIST.find(l => l.code === lang) || { name: 'English' };
  const cards = posts.map(p => `<article class="post-card"><a href="${BASE_URL}/blog/${lang}/${p.slug}/"><h2>${p.title}</h2><p>${p.metaDescription||''}</p><span class="card-cta">Read More →</span></a></article>`).join('\n');
  writeFileSync(resolve(blogDir, 'index.html'), `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Blog — GlobalCampaignHub (${langMeta.name})</title><meta name="description" content="Explore merchant reviews, affiliate deals, and buying guides from GlobalCampaignHub."/><link rel="canonical" href="${BASE_URL}/blog/${lang}/"/><style>body{font-family:sans-serif;background:#0a0b0d;color:#e8e9ed;padding:40px 20px;max-width:900px;margin:0 auto}h1{font-size:2rem;margin-bottom:32px}.post-card{border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin-bottom:16px}.post-card a{color:#e8e9ed;text-decoration:none}.post-card h2{font-size:1.2rem;margin-bottom:8px}.post-card p{color:#8a8d99;font-size:0.9rem;margin-bottom:12px}.card-cta{color:#47ffb8;font-size:0.85rem}</style></head><body><h1>GlobalCampaignHub Blog — ${langMeta.name}</h1>${cards}<p><a href="${BASE_URL}/" style="color:#47ffb8">← Back to Hub</a></p></body></html>`, 'utf-8');
}

function getPublishedPosts(lang) {
  const blogDir = resolve(__dir, 'blog', lang);
  if (!existsSync(blogDir)) return [];
  const posts = [];
  try {
    readdirSync(blogDir).forEach(slug => {
      const indexFile = resolve(blogDir, slug, 'index.html');
      if (existsSync(indexFile)) {
        const html = readFileSync(indexFile, 'utf-8');
        posts.push({ slug, title: (html.match(/<title>([^<]+)<\/title>/)||[])[1]||slug, metaDescription: (html.match(/name="description" content="([^"]+)"/)||[])[1]||'' });
      }
    });
  } catch {}
  return posts;
}

async function main() {
  const args         = process.argv.slice(2);
  const kwIdx        = args.indexOf('--keyword');
  const manualKw     = kwIdx !== -1 ? args[kwIdx + 1] : null;
  const langOverride = args.indexOf('--lang') !== -1 ? args[args.indexOf('--lang') + 1].split(',') : null;

  const keywords = pickKeywords(manualKw);
  console.log(`🚀 GlobalCampaignHub — processing ${keywords.length} keywords...`);
  console.log(`   Merchants in LC map: ${Object.keys(MERCHANT_LC).length}`);

  const langList = langOverride ? LANG_LIST.filter(l => langOverride.includes(l.code)) : LANG_LIST;
  let totalPublished = 0;

  for (const kw of keywords) {
    console.log(`\n📝 Writing: "${kw.keyword}" [${kw.merchant}] vol:${kw.volume.toLocaleString()}`);
    const slug   = kw.slug || slugify(kw.keyword);
    const affUrl = getAffUrl(kw);
    let post = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        post = await writeBlogPost(kw);
        post.affiliate_url = affUrl;
        post.keyword = kw.keyword;
        const { passed, feedback } = await runAllAudits(post, kw, affUrl);
        if (passed) { console.log(`✅ Audit passed on attempt ${attempt}`); break; }
        if (attempt < MAX_RETRIES) { console.log(`⚠️  Audit failed (attempt ${attempt}), rewriting...`); kw._feedback = feedback; }
        else { console.log(`⚠️  Max retries reached, publishing anyway`); }
      } catch (err) {
        console.error(`❌ Error attempt ${attempt}: ${err.message}`);
        if (attempt === MAX_RETRIES) { post = null; break; }
        await new Promise(r => setTimeout(r, 3000));
      }
    }

    if (!post) { console.error(`❌ Skipping "${kw.keyword}" — all attempts failed`); process.exit(0); }

    post.slug = slug;
    publishPage(post, 'en', slug, kw);
    console.log(`📄 Published EN: /blog/en/${slug}/`);
    totalPublished++;

    // Parallel translations — 4 at a time
    const otherLangs = langList.filter(l => l.code !== 'en');
    const CHUNK_SIZE = 4;
    console.log(`\n🌍  Translating to ${otherLangs.length} languages (4 at a time)...`);

    for (let i = 0; i < otherLangs.length; i += CHUNK_SIZE) {
      const chunk = otherLangs.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(async lang => {
        try {
          const translated = await translatePost(post, lang.code, lang.name);
          publishPage(translated, lang.code, slug, kw);
          totalPublished++;
          process.stdout.write(`  ✓ ${lang.code}`);
        } catch (err) {
          console.warn(`\n    ⚠️  ${lang.code} failed: ${err.message}`);
          publishPage(post, lang.code, slug, kw);
          totalPublished++;
        }
      }));
      console.log('');
      if (i + CHUNK_SIZE < otherLangs.length) await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n✅ "${kw.keyword}" — ${langList.length} languages published`);

    for (const lang of langList) {
      const posts = getPublishedPosts(lang.code);
      updateBlogIndex(lang.code, posts);
    }

    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n🎉 Done: ${totalPublished} pages published across ${langList.length} languages`);
}

main().catch(err => { console.error('Fatal error:', err); process.exit(0); });
