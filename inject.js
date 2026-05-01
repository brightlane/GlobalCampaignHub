#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB POST INJECTOR — v1.2
//  Run: node inject.js
//
//  Account: LinkConnector Account 2 (lc=007949...)
//  Tracking: gh- prefix on all atids (e.g. gh-movavi, gh-filmora)
//  Site: https://brightlane.github.io/GlobalCampaignHub/
//
//  DO NOT MIX with Brightlane (lc=014538...) — separate account entirely
//
//  v1.2 — ALL lc= codes corrected from affiliate.json — 2026-05-01
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

// ── ALL MERCHANTS — Account 2 (lc=007949...) — gh- prefix on all atids
// ── ✅ ALL lc= codes VERIFIED from affiliate.json — corrected 2026-05-01
// ── NEVER mix these with Brightlane (lc=014538...) links
const LINKS = {
  'gh-youware':                'https://www.linkconnector.com/ta.php?lc=007949164733007981&atid=gh-youware',
  'gh-atlantacutlery':         'https://www.linkconnector.com/ta.php?lc=007949069833005389&atid=gh-atlantacutlery',
  'gh-bannersonthecheap':      'https://www.linkconnector.com/ta.php?lc=007949076672005837&atid=gh-bannersonthecheap',
  'gh-bestvetcare':            'https://www.linkconnector.com/ta.php?lc=007949154901006218&atid=gh-bestvetcare',
  'gh-boardvitals':            'https://www.linkconnector.com/ta.php?lc=007949124366007614&atid=gh-boardvitals',
  'gh-budgetpetcare':          'https://www.linkconnector.com/ta.php?lc=007949144117006217&atid=gh-budgetpetcare',
  'gh-budgetpetworld':         'https://www.linkconnector.com/ta.php?lc=007949145753006206&atid=gh-budgetpetworld',
  'gh-bugatchi':               'https://www.linkconnector.com/ta.php?lc=007949094561006921&atid=gh-bugatchi',
  'gh-camanoislandcoffee':     'https://www.linkconnector.com/ta.php?lc=007949063057005492&atid=gh-camanoislandcoffee',
  'gh-canadapetcare':          'https://www.linkconnector.com/ta.php?lc=007949139296006219&atid=gh-canadapetcare',
  'gh-canvasonthecheap':       'https://www.linkconnector.com/ta.php?lc=007949084965006216&atid=gh-canvasonthecheap',
  'gh-carmellimo':             'https://www.linkconnector.com/ta.php?lc=007949021363003587&atid=gh-carmellimo',
  'gh-combatflipflops':        'https://www.linkconnector.com/ta.php?lc=007949108439006486&atid=gh-combatflipflops',
  'gh-depositphotos':          'https://www.linkconnector.com/ta.php?lc=007949040357004687&atid=gh-depositphotos',
  'gh-discountpetcare':        'https://www.linkconnector.com/ta.php?lc=007949161266007847&atid=gh-discountpetcare',
  'gh-etax':                   'https://www.linkconnector.com/ta.php?lc=007949136603007653&atid=gh-etax',
  'gh-efile':                  'https://www.linkconnector.com/ta.php?lc=007949053489005142&atid=gh-efile',
  'gh-easycanvasprints':       'https://www.linkconnector.com/ta.php?lc=007949043935004760&atid=gh-easycanvasprints',
  'gh-edraw':                  'https://www.linkconnector.com/ta.php?lc=007949165147006886&atid=gh-edraw',
  'gh-etchingexpressions':     'https://www.linkconnector.com/ta.php?lc=007949027749003958&atid=gh-etchingexpressions',
  'gh-famisafe':               'https://www.linkconnector.com/ta.php?lc=007949097766006788&atid=gh-famisafe',
  'gh-fieldtex':               'https://www.linkconnector.com/ta.php?lc=007949044236004764&atid=gh-fieldtex',
  'gh-graeters':               'https://www.linkconnector.com/ta.php?lc=007949155896007874&atid=gh-graeters',
  'gh-gunsinternational':      'https://www.linkconnector.com/ta.php?lc=007949050767005020&atid=gh-gunsinternational',
  'gh-halloweencostumes':      'https://www.linkconnector.com/ta.php?lc=007949047396004909&atid=gh-halloweencostumes',
  'gh-hrcp':                   'https://www.linkconnector.com/ta.php?lc=007949120619007379&atid=gh-hrcp',
  'gh-illumeo':                'https://www.linkconnector.com/ta.php?lc=007949104078006849&atid=gh-illumeo',
  'gh-incentrev':              'https://www.linkconnector.com/ta.php?lc=007949151790007794&atid=gh-incentrev',
  'gh-individualsoftware':     'https://www.linkconnector.com/ta.php?lc=007949046073005238&atid=gh-individualsoftware',
  'gh-infinitealoe':           'https://www.linkconnector.com/ta.php?lc=007949155212007855&atid=gh-infinitealoe',
  'gh-iskysoft':               'https://www.linkconnector.com/ta.php?lc=007949080054005679&atid=gh-iskysoft',
  'gh-itoolab':                'https://www.linkconnector.com/ta.php?lc=007949108972006513&atid=gh-itoolab',
  'gh-jalbum':                 'https://www.linkconnector.com/ta.php?lc=007949135821007664&atid=gh-jalbum',
  'gh-lafuente':               'https://www.linkconnector.com/ta.php?lc=007949034143001545&atid=gh-lafuente',
  'gh-learntasticcpr':         'https://www.linkconnector.com/ta.php?lc=007949155036007841&atid=gh-learntasticcpr',
  'gh-learntasticahca':        'https://www.linkconnector.com/ta.php?lc=007949146929007736&atid=gh-learntasticahca',
  'gh-maxpeedingrodsus':       'https://www.linkconnector.com/ta.php?lc=007949105959006539&atid=gh-maxpeedingrodsus',
  'gh-maxpeedingrodsau':       'https://www.linkconnector.com/ta.php?lc=007949101800006908&atid=gh-maxpeedingrodsau',
  'gh-movavi':                 'https://www.linkconnector.com/ta.php?lc=007949108972006513&atid=gh-movavi',
  'gh-museumreplicas':         'https://www.linkconnector.com/ta.php?lc=007949069873005391&atid=gh-museumreplicas',
  'gh-nordvpn':                'https://www.linkconnector.com/ta.php?lc=007949079282005891&atid=gh-nordvpn',
  'gh-nursejamie':             'https://www.linkconnector.com/ta.php?lc=007949155036007841&atid=gh-nursejamie',
  'gh-oakstone':               'https://www.linkconnector.com/ta.php?lc=007949049546004978&atid=gh-oakstone',
  'gh-personalabs':            'https://www.linkconnector.com/ta.php?lc=007949146929007736&atid=gh-personalabs',
  'gh-picador':                'https://www.linkconnector.com/ta.php?lc=007949164712007982&atid=gh-picador',
  'gh-productsonthego':        'https://www.linkconnector.com/ta.php?lc=007949108750007124&atid=gh-productsonthego',
  'gh-readygolf':              'https://www.linkconnector.com/ta.php?lc=007949135537007633&atid=gh-readygolf',
  'gh-renoise':                'https://www.linkconnector.com/ta.php?lc=007949165071007995&atid=gh-renoise',
  'gh-bgmgirl':                'https://www.linkconnector.com/ta.php?lc=007949162099007840&atid=gh-bgmgirl',
  'gh-ryonet':                 'https://www.linkconnector.com/ta.php?lc=007949155911007876&atid=gh-ryonet',
  'gh-sidify':                 'https://www.linkconnector.com/ta.php?lc=007949114494007306&atid=gh-sidify',
  'gh-appypie':                'https://www.linkconnector.com/ta.php?lc=007949090967005541&atid=gh-appypie',
  'gh-pmtraining':             'https://www.linkconnector.com/ta.php?lc=007949081796006139&atid=gh-pmtraining',
  'gh-surgent':                'https://www.linkconnector.com/ta.php?lc=007949138896006249&atid=gh-surgent',
  'gh-surveyjunkie':           'https://www.linkconnector.com/ta.php?lc=007949153848007834&atid=gh-surveyjunkie',
  'gh-tastyribbon':            'https://www.linkconnector.com/ta.php?lc=007949155938007865&atid=gh-tastyribbon',
  'gh-taxextension':           'https://www.linkconnector.com/ta.php?lc=007949121281006198&atid=gh-taxextension',
  'gh-tenorshare':             'https://www.linkconnector.com/ta.php?lc=007949139287006847&atid=gh-tenorshare',
  'gh-ayurvedaexperience':     'https://www.linkconnector.com/ta.php?lc=007949126292007580&atid=gh-ayurvedaexperience',
  'gh-thechessstore':          'https://www.linkconnector.com/ta.php?lc=007949071778005057&atid=gh-thechessstore',
  'gh-securitiesinstitute':    'https://www.linkconnector.com/ta.php?lc=007949108329007101&atid=gh-securitiesinstitute',
  'gh-trademarkhardware':      'https://www.linkconnector.com/ta.php?lc=007949113406007272&atid=gh-trademarkhardware',
  'gh-trademarksoundproofing': 'https://www.linkconnector.com/ta.php?lc=007949107911007070&atid=gh-trademarksoundproofing',
  'gh-updf':                   'https://www.linkconnector.com/ta.php?lc=007949147521007728&atid=gh-updf',
  'gh-vipertec':               'https://www.linkconnector.com/ta.php?lc=007949091308006550&atid=gh-vipertec',
  'gh-warehouse115':           'https://www.linkconnector.com/ta.php?lc=007949102471006776&atid=gh-warehouse115',
  'gh-filmora':                'https://www.linkconnector.com/ta.php?lc=007949048607004532&atid=gh-filmora',
  'gh-pdfelement':             'https://www.linkconnector.com/ta.php?lc=007949139355006776&atid=gh-pdfelement',
  'gh-wolterskluwer':          'https://www.linkconnector.com/ta.php?lc=007949019993003224&atid=gh-wolterskluwer',
  'gh-eztaxreturn':            'https://www.eztaxreturn.com', // not approved on LC — direct URL
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
  console.log('\n🌍 GLOBALCAMPAIGNHUB POST INJECTOR v1.2 — 20 Languages');
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
