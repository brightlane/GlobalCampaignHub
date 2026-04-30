#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB POST INJECTOR — v1.0
//  Run: node inject.js
//
//  Account: LinkConnector Account 2 (lc=007949...)
//  Tracking: gh- prefix on all atids (e.g. gh-movavi, gh-filmora)
//  Site: https://brightlane.github.io/GlobalCampaignHub/
//
//  DO NOT MIX with Brightlane (lc=014538...) — separate account entirely
// ═══════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const BASE_URL  = 'https://brightlane.github.io/GlobalCampaignHub';
const TODAY     = new Date().toISOString().slice(0, 10);
const LOG_FILE  = 'injector-log.json';
const TOPICS    = 'post-topics.json';
const LLMS_FILE = 'llms.txt';
const MAX_POSTS = 20;

// ── 20 language blog files
const LANGUAGES = [
  { code: 'en',    file: 'blog.html',       lang: 'en',    label: 'English' },
  { code: 'zh',    file: 'blog-zh.html',    lang: 'zh',    label: 'Chinese' },
  { code: 'zh-tw', file: 'blog-zh-tw.html', lang: 'zh-tw', label: 'Traditional Chinese' },
  { code: 'es',    file: 'blog-es.html',    lang: 'es',    label: 'Spanish' },
  { code: 'fr',    file: 'blog-fr.html',    lang: 'fr',    label: 'French' },
  { code: 'de',    file: 'blog-de.html',    lang: 'de',    label: 'German' },
  { code: 'pt',    file: 'blog-pt.html',    lang: 'pt',    label: 'Portuguese' },
  { code: 'pt-br', file: 'blog-pt-br.html', lang: 'pt-br', label: 'Portuguese BR' },
  { code: 'ja',    file: 'blog-ja.html',    lang: 'ja',    label: 'Japanese' },
  { code: 'ko',    file: 'blog-ko.html',    lang: 'ko',    label: 'Korean' },
  { code: 'it',    file: 'blog-it.html',    lang: 'it',    label: 'Italian' },
  { code: 'nl',    file: 'blog-nl.html',    lang: 'nl',    label: 'Dutch' },
  { code: 'pl',    file: 'blog-pl.html',    lang: 'pl',    label: 'Polish' },
  { code: 'hi',    file: 'blog-hi.html',    lang: 'hi',    label: 'Hindi' },
  { code: 'ar',    file: 'blog-ar.html',    lang: 'ar',    label: 'Arabic' },
  { code: 'ru',    file: 'blog-ru.html',    lang: 'ru',    label: 'Russian' },
  { code: 'tr',    file: 'blog-tr.html',    lang: 'tr',    label: 'Turkish' },
  { code: 'id',    file: 'blog-id.html',    lang: 'id',    label: 'Indonesian' },
  { code: 'vi',    file: 'blog-vi.html',    lang: 'vi',    label: 'Vietnamese' },
  { code: 'th',    file: 'blog-th.html',    lang: 'th',    label: 'Thai' },
];

// ── ALL 68 MERCHANTS — Account 2 (lc=007949...) — gh- prefix on all atids
// ── NEVER mix these with Brightlane (lc=014538...) links
const LINKS = {
  'gh-efile':               'https://www.linkconnector.com/ta.php?lc=007949021469002241&atid=gh-efile',
  'gh-etax':                'https://www.linkconnector.com/ta.php?lc=007949113645003507&atid=gh-etax',
  'gh-taxextension':        'https://www.linkconnector.com/ta.php?lc=007949033342002305&atid=gh-taxextension',
  'gh-eztaxreturn':         'https://www.linkconnector.com/ta.php?lc=007949053344004952&atid=gh-eztaxreturn',
  'gh-boardvitals':         'https://www.linkconnector.com/ta.php?lc=007949114675005824&atid=gh-boardvitals',
  'gh-ryonet':              'https://www.linkconnector.com/ta.php?lc=007949084633004512&atid=gh-ryonet',
  'gh-surgent':             'https://www.linkconnector.com/ta.php?lc=007949123344006122&atid=gh-surgent',
  'gh-hrcp':                'https://www.linkconnector.com/ta.php?lc=007949093344005114&atid=gh-hrcp',
  'gh-oakstone':            'https://www.linkconnector.com/ta.php?lc=007949103344005432&atid=gh-oakstone',
  'gh-securitiesinstitute': 'https://www.linkconnector.com/ta.php?lc=007949113344005987&atid=gh-securitiesinstitute',
  'gh-nordvpn':             'https://www.linkconnector.com/ta.php?lc=007949143344006843&atid=gh-nordvpn',
  'gh-depositphotos':       'https://www.linkconnector.com/ta.php?lc=007949063344003921&atid=gh-depositphotos',
  'gh-halloweencostumes':   'https://www.linkconnector.com/ta.php?lc=007949053344002874&atid=gh-halloweencostumes',
  'gh-filmora':             'https://www.linkconnector.com/ta.php?lc=007949165260004532&atid=gh-filmora',
  'gh-pdfelement':          'https://www.linkconnector.com/ta.php?lc=007949165372004532&atid=gh-pdfelement',
  'gh-edraw':               'https://www.linkconnector.com/ta.php?lc=007949165246006886&atid=gh-edraw',
  'gh-canadapetcare':       'https://www.linkconnector.com/ta.php?lc=007949083344004721&atid=gh-canadapetcare',
  'gh-bestvetcare':         'https://www.linkconnector.com/ta.php?lc=007949093344004992&atid=gh-bestvetcare',
  'gh-budgetpetcare':       'https://www.linkconnector.com/ta.php?lc=007949103344005118&atid=gh-budgetpetcare',
  'gh-budgetpetworld':      'https://www.linkconnector.com/ta.php?lc=007949113344005224&atid=gh-budgetpetworld',
  'gh-discountpetcare':     'https://www.linkconnector.com/ta.php?lc=007949123344005441&atid=gh-discountpetcare',
  'gh-nursejamie':          'https://www.linkconnector.com/ta.php?lc=007949153344007112&atid=gh-nursejamie',
  'gh-maxpeedingrodsus':    'https://www.linkconnector.com/ta.php?lc=007949133344006421&atid=gh-maxpeedingrodsus',
  'gh-maxpeedingrodsau':    'https://www.linkconnector.com/ta.php?lc=007949143344006554&atid=gh-maxpeedingrodsau',
  'gh-trademarkhardware':   'https://www.linkconnector.com/ta.php?lc=007949123344005912&atid=gh-trademarkhardware',
  'gh-trademarksoundproofing': 'https://www.linkconnector.com/ta.php?lc=007949133344006118&atid=gh-trademarksoundproofing',
  'gh-warehouse115':        'https://www.linkconnector.com/ta.php?lc=007949163344007442&atid=gh-warehouse115',
  'gh-graeters':            'https://www.linkconnector.com/ta.php?lc=007949073344004112&atid=gh-graeters',
  'gh-etchingexpressions':  'https://www.linkconnector.com/ta.php?lc=007949083344004332&atid=gh-etchingexpressions',
  'gh-thechessstore':       'https://www.linkconnector.com/ta.php?lc=007949103344005112&atid=gh-thechessstore',
  'gh-museumreplicas':      'https://www.linkconnector.com/ta.php?lc=007949113344005442&atid=gh-museumreplicas',
  'gh-atlantacutlery':      'https://www.linkconnector.com/ta.php?lc=007949123344005771&atid=gh-atlantacutlery',
  'gh-vipertec':            'https://www.linkconnector.com/ta.php?lc=007949133344006224&atid=gh-vipertec',
  'gh-combatflipflops':     'https://www.linkconnector.com/ta.php?lc=007949143344006881&atid=gh-combatflipflops',
  'gh-camanoislandcoffee':  'https://www.linkconnector.com/ta.php?lc=007949053344002441&atid=gh-camanoislandcoffee',
  'gh-sidify':              'https://www.linkconnector.com/ta.php?lc=007949163344007882&atid=gh-sidify',
  'gh-movavi':              'https://www.linkconnector.com/ta.php?lc=007949153344007119&atid=gh-movavi',
  'gh-jalbum':              'https://www.linkconnector.com/ta.php?lc=007949143344006442&atid=gh-jalbum',
  'gh-updf':                'https://www.linkconnector.com/ta.php?lc=007949163344008112&atid=gh-updf',
  'gh-itoolab':             'https://www.linkconnector.com/ta.php?lc=007949163344008441&atid=gh-itoolab',
  'gh-tenorshare':          'https://www.linkconnector.com/ta.php?lc=007949163344008992&atid=gh-tenorshare',
  'gh-appypie':             'https://www.linkconnector.com/ta.php?lc=007949153344007442&atid=gh-appypie',
  'gh-illumeo':             'https://www.linkconnector.com/ta.php?lc=007949143344006221&atid=gh-illumeo',
  'gh-wolterskluwer':       'https://www.linkconnector.com/ta.php?lc=007949165370003224&atid=gh-wolterskluwer',
  'gh-individualsoftware':  'https://www.linkconnector.com/ta.php?lc=007949133344005882&atid=gh-individualsoftware',
  'gh-learntasticcpr':      'https://www.linkconnector.com/ta.php?lc=007949143344006112&atid=gh-learntasticcpr',
  'gh-learntasticahca':     'https://www.linkconnector.com/ta.php?lc=007949143344006113&atid=gh-learntasticahca',
  'gh-personalabs':         'https://www.linkconnector.com/ta.php?lc=007949133344005442&atid=gh-personalabs',
  'gh-fieldtex':            'https://www.linkconnector.com/ta.php?lc=007949123344005118&atid=gh-fieldtex',
  'gh-productsonthego':     'https://www.linkconnector.com/ta.php?lc=007949113344004882&atid=gh-productsonthego',
  'gh-readygolf':           'https://www.linkconnector.com/ta.php?lc=007949103344004551&atid=gh-readygolf',
  'gh-gunsinternational':   'https://www.linkconnector.com/ta.php?lc=007949093344004221&atid=gh-gunsinternational',
  'gh-lafuente':            'https://www.linkconnector.com/ta.php?lc=007949083344003992&atid=gh-lafuente',
  'gh-bannersonthecheap':   'https://www.linkconnector.com/ta.php?lc=007949073344003661&atid=gh-bannersonthecheap',
  'gh-canvasonthecheap':    'https://www.linkconnector.com/ta.php?lc=007949073344003662&atid=gh-canvasonthecheap',
  'gh-easycanvasprints':    'https://www.linkconnector.com/ta.php?lc=007949063344003112&atid=gh-easycanvasprints',
  'gh-carmellimo':          'https://www.linkconnector.com/ta.php?lc=007949053344002881&atid=gh-carmellimo',
  'gh-youware':             'https://www.linkconnector.com/ta.php?lc=007949163344008118&atid=gh-youware',
  'gh-bugatchi':            'https://www.linkconnector.com/ta.php?lc=007949153344007662&atid=gh-bugatchi',
  'gh-pmtraining':          'https://www.linkconnector.com/ta.php?lc=007949143344006992&atid=gh-pmtraining',
  'gh-surveyjunkie':        'https://www.linkconnector.com/ta.php?lc=007949033344001882&atid=gh-surveyjunkie',
  'gh-tastyribbon':         'https://www.linkconnector.com/ta.php?lc=007949153344007881&atid=gh-tastyribbon',
  'gh-ayurvedaexperience':  'https://www.linkconnector.com/ta.php?lc=007949163344008221&atid=gh-ayurvedaexperience',
  'gh-bgmgirl':             'https://www.linkconnector.com/ta.php?lc=007949153344007992&atid=gh-bgmgirl',
  'gh-renoise':             'https://www.linkconnector.com/ta.php?lc=007949143344006551&atid=gh-renoise',
  'gh-picador':             'https://www.linkconnector.com/ta.php?lc=007949133344006228&atid=gh-picador',
  'gh-incentrev':           'https://www.linkconnector.com/ta.php?lc=007949123344005991&atid=gh-incentrev',
  'gh-buildasign':          'https://www.linkconnector.com/ta.php?lc=007949043344001995&atid=gh-buildasign',
};

function affLink(merchantId, pos, slug, langCode) {
  const base = LINKS[merchantId];
  if (!base) return '#';
  const u = new URL(base);
  u.searchParams.set('utm_source', `gh-blog-${langCode}`);
  u.searchParams.set('utm_medium', 'affiliate');
  u.searchParams.set('utm_campaign', slug);
  u.searchParams.set('utm_content', `pos-${pos}`);
  return u.toString();
}

function field(topic, name, langCode) {
  const fallbacks = [langCode];
  if (langCode === 'zh-tw') fallbacks.push('zh');
  if (langCode === 'pt-br') fallbacks.push('pt');
  fallbacks.push('en');
  for (const code of fallbacks) {
    const val = topic[`${name}_${code}`];
    if (val) return val;
  }
  return '';
}

function arrayField(topic, name, langCode) {
  const fallbacks = [langCode];
  if (langCode === 'zh-tw') fallbacks.push('zh');
  if (langCode === 'pt-br') fallbacks.push('pt');
  fallbacks.push('en');
  for (const code of fallbacks) {
    const val = topic[`${name}_${code}`];
    if (Array.isArray(val) && val.length > 0) return val;
  }
  return [];
}

const READ_TIMES = {
  en: '4 min read',       zh: '4分钟阅读',         'zh-tw': '4分鐘閱讀',
  es: '4 min de lectura', fr: '4 min de lecture',  de: '4 Min. Lesezeit',
  pt: '4 min de leitura', 'pt-br': '4 min de leitura', ja: '4分で読めます',
  ko: '4분 읽기',          it: '4 min di lettura',  nl: '4 min lezen',
  pl: '4 min czytania',   hi: '4 मिनट पढ़ें',       ar: '4 دقائق قراءة',
  ru: '4 мин чтения',     tr: '4 dk okuma',        id: '4 menit baca',
  vi: '4 phút đọc',       th: '4 นาทีอ่าน'
};

function buildBodyHtml(topic, slug, langCode) {
  const merchantId   = topic.merchant;
  const link1        = affLink(merchantId, 1, slug, langCode);
  const link2        = affLink(merchantId, 2, slug, langCode);
  const intro        = field(topic, 'intro', langCode);
  const callout      = field(topic, 'callout', langCode);
  const h2a          = field(topic, 'h2a', langCode);
  const body1        = field(topic, 'body1', langCode);
  const bullets      = arrayField(topic, 'bullets', langCode);
  const verdictTitle = field(topic, 'verdict_title', langCode);
  const verdictDesc  = field(topic, 'verdict_desc', langCode);
  const cta          = field(topic, 'cta', langCode);
  const h2b          = field(topic, 'h2b', langCode);
  const body2        = field(topic, 'body2', langCode);
  const cta2         = field(topic, 'cta2', langCode);
  const bulletsHtml  = bullets.map(b => `<li>${b}</li>`).join('');

  return `
      <p>${intro}</p>
      <div class="callout"><strong>★</strong>${callout}</div>
      <h2>${h2a}</h2>
      <p>${body1}</p>
      <ul>${bulletsHtml}</ul>
      <div class="verdict">
        <div class="verdict-label">★</div>
        <div class="verdict-title">${verdictTitle}</div>
        <div class="verdict-desc">${verdictDesc}</div>
        <a href="${link1}" class="cta-btn" target="_blank" rel="noopener sponsored">${cta} →</a>
      </div>
      <h2>${h2b}</h2>
      <p>${body2}</p>
      <a href="${link2}" class="cta-btn-outline" target="_blank" rel="noopener sponsored" style="margin-top:12px;display:inline-flex">${cta2} →</a>
    `;
}

function buildPostObject(topic, slug, langCode) {
  const slugKey    = `${slug}__${TODAY}`;
  const title      = field(topic, 'title', langCode);
  const category   = field(topic, 'category', langCode);
  const metaDesc   = field(topic, 'metaDesc', langCode);
  const keywords   = field(topic, 'keywords', langCode);
  const faqs       = arrayField(topic, 'faqs', langCode);
  const bodyHtml   = buildBodyHtml(topic, slug, langCode);

  return `
    "${slugKey}": {
      title: ${JSON.stringify(title)},
      titleHl: ${JSON.stringify(title)},
      titleRest: "",
      category: ${JSON.stringify(category)},
      readTime: ${JSON.stringify(READ_TIMES[langCode] || '4 min read')},
      date: ${JSON.stringify(TODAY)},
      metaDesc: ${JSON.stringify(metaDesc)},
      keywords: ${JSON.stringify(keywords)},
      faqs: ${JSON.stringify(faqs)},
      render: (slug) => \`${bodyHtml.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`
    },`;
}

function injectIntoBlog(filePath, postObjStr) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ ${filePath} not found — skipping`);
    return false;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  const marker = 'const POSTS = {';
  const idx = html.indexOf(marker);
  if (idx === -1) {
    console.warn(`  ⚠ POSTS marker not found in ${filePath}`);
    return false;
  }
  const insertAt = idx + marker.length;
  html = html.slice(0, insertAt) + postObjStr + html.slice(insertAt);
  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

function updateSitemap(slug) {
  const sitemapPath = 'sitemap.xml';
  if (!fs.existsSync(sitemapPath)) {
    console.warn('  ⚠ sitemap.xml not found — skipping');
    return;
  }
  const slugKey  = `${slug}__${TODAY}`;
  const xDefault = `${BASE_URL}/blog.html?p=${slugKey}`;
  const variants = LANGUAGES.map(l => ({
    lang: l.lang,
    url:  `${BASE_URL}/${l.file}?p=${slugKey}`
  }));
  const newBlocks = variants.map(({ lang, url }) => {
    const links = [
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}"/>`,
      ...variants.map(v => `    <xhtml:link rel="alternate" hreflang="${v.lang}" href="${v.url}"/>`)
    ].join('\n');
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
${links}
  </url>`;
  }).join('\n');
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  sitemap = sitemap.replace('</urlset>', newBlocks + '\n</urlset>');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`  ✓ sitemap.xml updated — ${LANGUAGES.length} URL blocks`);
}

function updateLlms(topic, slug) {
  if (!fs.existsSync(LLMS_FILE)) return;
  const slugKey = `${slug}__${TODAY}`;
  const title   = topic.title_en || slug;
  const url     = `${BASE_URL}/blog.html?p=${slugKey}`;
  const newLine = `- [${title}](${url})`;
  const marker  = '## Recent Posts';
  let content   = fs.readFileSync(LLMS_FILE, 'utf8');
  content = content.replace(/# Updated automatically.*$/m, `# Updated automatically by Vulture Titan Engine on ${TODAY}`);
  const markerIdx = content.indexOf(marker);
  if (markerIdx === -1) {
    content += `\n${marker}\n\n${newLine}\n`;
  } else {
    const afterMarker = content.slice(markerIdx + marker.length);
    const existingLines = afterMarker.split('\n').filter(l => l.trim().startsWith('- ['));
    const allLines = [newLine, ...existingLines].slice(0, MAX_POSTS);
    content = content.slice(0, markerIdx + marker.length) + '\n\n' + allLines.join('\n') + '\n';
  }
  fs.writeFileSync(LLMS_FILE, content, 'utf8');
  console.log(`  ✓ llms.txt updated`);
}

function logRun(topic, results) {
  let log = [];
  if (fs.existsSync(LOG_FILE)) {
    try { log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch(e) {}
  }
  log.push({
    date:               TODAY,
    slug:               topic.slug,
    merchant:           topic.merchant,
    title:              topic.title_en || topic.slug,
    languages_injected: results.filter(r => r.ok).map(r => r.lang),
    languages_skipped:  results.filter(r => !r.ok).map(r => r.lang)
  });
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8');
}

function main() {
  console.log('\n🌍 GLOBALCAMPAIGNHUB POST INJECTOR v1.0 — 15 Languages');
  console.log('════════════════════════════════════════════════════════');
  console.log(`Account: LinkConnector 007949 | Tracking: gh- prefix`);
  console.log(`Date: ${TODAY}\n`);

  if (!fs.existsSync(TOPICS)) {
    console.error(`✗ ${TOPICS} not found.`);
    process.exit(1);
  }

  const topicsData = JSON.parse(fs.readFileSync(TOPICS, 'utf8'));
  const pending    = topicsData.topics.filter(t => !t.published);

  if (pending.length === 0) {
    console.log('✓ All topics published — nothing to inject today.');
    process.exit(0);
  }

  const topic = pending[0];
  console.log(`Topic:    ${topic.title_en || topic.slug}`);
  console.log(`Merchant: ${topic.merchant}`);
  console.log(`Slug:     ${topic.slug}`);
  console.log(`Queue:    ${pending.length} topics remaining\n`);

  console.log('Injecting into blog files...');
  const results = [];

  for (const lang of LANGUAGES) {
    const objStr = buildPostObject(topic, topic.slug, lang.code);
    const ok     = injectIntoBlog(lang.file, objStr);
    results.push({ lang: lang.code, ok });
    if (ok) console.log(`  ✓ ${lang.file} (${lang.label})`);
  }

  console.log('\nUpdating sitemap...');
  updateSitemap(topic.slug);

  console.log('Updating llms.txt...');
  updateLlms(topic, topic.slug);

  const topicIdx = topicsData.topics.findIndex(t => t.slug === topic.slug);
  topicsData.topics[topicIdx].published      = true;
  topicsData.topics[topicIdx].published_date = TODAY;
  fs.writeFileSync(TOPICS, JSON.stringify(topicsData, null, 2), 'utf8');

  logRun(topic, results);

  const injected = results.filter(r => r.ok).length;
  console.log(`\n✅ Done! ${injected}/${LANGUAGES.length} blog files updated.`);
  console.log(`Topics remaining: ${pending.length - 1}`);
  console.log('════════════════════════════════════════════════════════\n');
}

main();
