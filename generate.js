#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB CONTENT GENERATOR v1.2
//  Run: node generate.js [command] [options]
//
//  Commands:
//    node generate.js status
//    node generate.js topics          — generate 20 new post topics
//    node generate.js topics --n=50   — generate 50 new post topics
//    node generate.js keywords        — generate 50 new keywords
//    node generate.js keywords --n=100
//    node generate.js blog --slug=nordvpn-review-2026
//    node generate.js campaign --kw="best vpn 2026"
//    node generate.js all
//
//  Account: LinkConnector 007949 | Tracking: gh- atid prefix
//  v1.2 — Deduplicated, all lc= codes corrected from affiliate.json
// ═══════════════════════════════════════════════════════════════════════

const fs    = require('fs');
const https = require('https');

const MODEL   = 'claude-sonnet-4-20250514';
const API_KEY = process.env.ANTHROPIC_API_KEY;
const TODAY   = new Date().toISOString().slice(0, 10);
const BASE    = 'https://brightlane.github.io/GlobalCampaignHub';
const GEN_LOG = 'topic-generator-log.json';

// ── ALL 67 MERCHANTS — lc= codes verified from affiliate.json 2026-05-01
// ── BGM Girl and BuildASign removed
const MERCHANTS = [
  // TAX (3)
  { id:'gh-efile',                 name:'E-file.com',               cat:'Tax',       lc:'007949053489005142', slug:'efile-vs-turbotax-2026' },
  { id:'gh-etax',                  name:'E TAX LLC',                cat:'Tax',       lc:'007949136603007653', slug:'etax-llc-tax-filing-2026' },
  { id:'gh-taxextension',          name:'TaxExtension.com',         cat:'Tax',       lc:'007949121281006198', slug:'tax-extension-deadline-guide-2026' },
  // SOFTWARE (19)
  { id:'gh-nordvpn',               name:'NordVPN',                  cat:'Software',  lc:'007949079282005891', slug:'nordvpn-review-2026' },
  { id:'gh-filmora',               name:'Wondershare Filmora',      cat:'Software',  lc:'007949048607004532', slug:'filmora-ai-features-2026' },
  { id:'gh-pdfelement',            name:'Wondershare PDFelement',   cat:'Software',  lc:'007949165237004532', slug:'pdfelement-vs-acrobat-2026' },
  { id:'gh-sidify',                name:'Sidify Inc.',              cat:'Software',  lc:'007949114494007306', slug:'sidify-spotify-converter-2026' },
  { id:'gh-movavi',                name:'Movavi Software',          cat:'Software',  lc:'007949108972006513', slug:'movavi-video-editor-2026' },
  { id:'gh-tenorshare',            name:'Tenorshare',               cat:'Software',  lc:'007949139287006847', slug:'tenorshare-iphone-tools-2026' },
  { id:'gh-appypie',               name:'Appy Pie',                 cat:'Software',  lc:'007949090967005541', slug:'appy-pie-no-code-tools-2026' },
  { id:'gh-updf',                  name:'UPDF (Superace)',          cat:'Software',  lc:'007949154707007728', slug:'updf-pdf-editor-review-2026' },
  { id:'gh-itoolab',               name:'iToolab (LuckyDog)',       cat:'Software',  lc:'007949110667007185', slug:'itoolab-iphone-manager-2026' },
  { id:'gh-famisafe',              name:'FamiSafe (Wondershare)',   cat:'Software',  lc:'007949097766006788', slug:'famisafe-parental-control-2026' },
  { id:'gh-depositphotos',         name:'Depositphotos',            cat:'Software',  lc:'007949040357004687', slug:'depositphotos-review-2026' },
  { id:'gh-edraw',                 name:'Edraw (Mind/Max)',         cat:'Software',  lc:'007949165147006886', slug:'edraw-mind-map-review-2026' },
  { id:'gh-iskysoft',              name:'iSkysoft Software',        cat:'Software',  lc:'007949080054005679', slug:'iskysoft-review-2026' },
  { id:'gh-jalbum',                name:'jAlbum AB',                cat:'Software',  lc:'007949135821007664', slug:'jalbum-photo-gallery-2026' },
  { id:'gh-renoise',               name:'Renoise',                  cat:'Software',  lc:'007949165071007995', slug:'renoise-music-production-2026' },
  { id:'gh-picador',               name:'Picador Multimedia',       cat:'Software',  lc:'007949164712007982', slug:'picador-multimedia-review-2026' },
  { id:'gh-youware',               name:'YouWare',                  cat:'Software',  lc:'007949164733007981', slug:'youware-review-2026' },
  { id:'gh-individualsoftware',    name:'Individual Software',      cat:'Software',  lc:'007949046073005238', slug:'individual-software-review-2026' },
  // EDUCATION (10)
  { id:'gh-boardvitals',           name:'BoardVitals',              cat:'Education', lc:'007949124366007614', slug:'boardvitals-medical-exam-prep-2026' },
  { id:'gh-surgent',               name:'Surgent CPA',              cat:'Education', lc:'007949138896006249', slug:'surgent-cpa-exam-prep-2026' },
  { id:'gh-pmtraining',            name:'SSI Logic (PMTraining)',   cat:'Education', lc:'007949081796006139', slug:'pm-training-pmp-2026' },
  { id:'gh-learntasticcpr',        name:'LearnTastic CPR',          cat:'Education', lc:'007949103653006955', slug:'learntastic-cpr-certification-2026' },
  { id:'gh-securitiesinstitute',   name:'The Securities Institute', cat:'Education', lc:'007949108329007101', slug:'securities-institute-exam-prep-2026' },
  { id:'gh-illumeo',               name:'Illumeo, Inc.',            cat:'Education', lc:'007949104078006849', slug:'illumeo-professional-development-2026' },
  { id:'gh-hrcp',                  name:'HRCP',                     cat:'Education', lc:'007949120619007379', slug:'hrcp-hr-certification-2026' },
  { id:'gh-oakstone',              name:'Oakstone Medical',         cat:'Education', lc:'007949049546004978', slug:'oakstone-cme-review-2026' },
  { id:'gh-wolterskluwer',         name:'Wolters Kluwer (LWW)',     cat:'Education', lc:'007949165370003224', slug:'wolters-kluwer-medical-books-2026' },
  { id:'gh-learntasticahca',       name:'LearnTastic AHCA',         cat:'Education', lc:'007949047416004897', slug:'learntastic-ahca-review-2026' },
  // PET CARE (5)
  { id:'gh-canadapetcare',         name:'CanadaPetCare.com',        cat:'Pet Care',  lc:'007949139296006219', slug:'canada-pet-care-vs-vet-2026' },
  { id:'gh-budgetpetcare',         name:'BudgetPetCare.com',        cat:'Pet Care',  lc:'007949144117006217', slug:'budget-pet-care-guide-2026' },
  { id:'gh-bestvetcare',           name:'BestVetCare.com',          cat:'Pet Care',  lc:'007949154901006218', slug:'bestvetcare-review-2026' },
  { id:'gh-discountpetcare',       name:'DiscountPetCare',          cat:'Pet Care',  lc:'007949161266007847', slug:'discountpetcare-review-2026' },
  { id:'gh-budgetpetworld',        name:'BudgetPetWorld.com',       cat:'Pet Care',  lc:'007949145753006206', slug:'budgetpetworld-review-2026' },
  // HEALTH (5)
  { id:'gh-personalabs',           name:'Personalabs',              cat:'Health',    lc:'007949146929007736', slug:'personalabs-lab-tests-2026' },
  { id:'gh-ayurvedaexperience',    name:'The Ayurveda Experience',  cat:'Health',    lc:'007949126292007580', slug:'ayurveda-experience-review-2026' },
  { id:'gh-nursejamie',            name:'Nurse Jamie',              cat:'Health',    lc:'007949155036007841', slug:'nurse-jamie-review-2026' },
  { id:'gh-infinitealoe',          name:'InfiniteAloe',             cat:'Health',    lc:'007949155212007855', slug:'infinitealoe-skincare-review-2026' },
  { id:'gh-fieldtex',              name:'Fieldtex Products',        cat:'Health',    lc:'007949044236004764', slug:'fieldtex-first-aid-2026' },
  // AUTO (3)
  { id:'gh-maxpeedingrodsus',      name:'Maxpeedingrods (US)',      cat:'Auto',      lc:'007949105959006539', slug:'maxpeedingrods-review-2026' },
  { id:'gh-maxpeedingrodsau',      name:'Maxpeedingrods (AU)',      cat:'Auto',      lc:'007949101800006908', slug:'maxpeedingrods-au-review-2026' },
  { id:'gh-lafuente',              name:'La Fuente Imports',        cat:'Auto',      lc:'007949034143001545', slug:'la-fuente-imports-review-2026' },
  // PRINT (5) — BuildASign removed
  { id:'gh-easycanvasprints',      name:'Easy Canvas Prints',       cat:'Print',     lc:'007949043935004760', slug:'easy-canvas-prints-guide-2026' },
  { id:'gh-etchingexpressions',    name:'Etching Expressions',      cat:'Print',     lc:'007949027749003958', slug:'etching-expressions-gifts-2026' },
  { id:'gh-bannersonthecheap',     name:'BannersOnTheCheap',        cat:'Print',     lc:'007949076672005837', slug:'banners-on-the-cheap-guide-2026' },
  { id:'gh-canvasonthecheap',      name:'CanvasOnTheCheap',         cat:'Print',     lc:'007949084965006216', slug:'canvas-on-the-cheap-guide-2026' },
  { id:'gh-ryonet',                name:'Ryonet',                   cat:'Print',     lc:'007949155911007876', slug:'ryonet-screen-printing-2026' },
  // HARDWARE (4)
  { id:'gh-trademarkhardware',     name:'Trademark Hardware',       cat:'Hardware',  lc:'007949113406007272', slug:'trademark-hardware-guide-2026' },
  { id:'gh-trademarksoundproofing',name:'Trademark Soundproofing',  cat:'Hardware',  lc:'007949107911007070', slug:'soundproofing-guide-2026' },
  { id:'gh-warehouse115',          name:'Warehouse 115',            cat:'Hardware',  lc:'007949102471006776', slug:'warehouse115-review-2026' },
  { id:'gh-productsonthego',       name:'Products On The Go',       cat:'Hardware',  lc:'007949137847007124', slug:'products-on-the-go-2026' },
  // LIFESTYLE (17) — BGM Girl removed
  { id:'gh-halloweencostumes',     name:'HalloweenCostumes.com',    cat:'Lifestyle', lc:'007949047396004909', slug:'halloween-costumes-guide-2026' },
  { id:'gh-surveyjunkie',          name:'Survey Junkie',            cat:'Lifestyle', lc:'007949153848007834', slug:'surveyjunkie-earn-online-2026' },
  { id:'gh-graeters',              name:"Graeter's Ice Cream",      cat:'Lifestyle', lc:'007949155896007874', slug:'graeter-ice-cream-delivery-2026' },
  { id:'gh-carmellimo',            name:'Carmel Car & Limo',        cat:'Lifestyle', lc:'007949021363003587', slug:'carmel-limo-service-2026' },
  { id:'gh-tastyribbon',           name:'Tasty Ribbon',             cat:'Lifestyle', lc:'007949155938007865', slug:'tasty-ribbon-food-gifts-2026' },
  { id:'gh-combatflipflops',       name:'Combat Flip Flops',        cat:'Lifestyle', lc:'007949108439006486', slug:'combat-flip-flops-mission-2026' },
  { id:'gh-camanoislandcoffee',    name:'Camano Island Coffee',     cat:'Lifestyle', lc:'007949063057005492', slug:'camano-island-coffee-review-2026' },
  { id:'gh-gunsinternational',     name:'GunsInternational',        cat:'Lifestyle', lc:'007949050767005020', slug:'gunsinternational-marketplace-2026' },
  { id:'gh-thechessstore',         name:'The Chess Store',          cat:'Lifestyle', lc:'007949071778005057', slug:'chess-store-buying-guide-2026' },
  { id:'gh-museumreplicas',        name:'MuseumReplicas.com',       cat:'Lifestyle', lc:'007949069873005391', slug:'museum-replicas-collectibles-2026' },
  { id:'gh-atlantacutlery',        name:'Atlanta Cutlery Corp.',    cat:'Lifestyle', lc:'007949069833005389', slug:'atlanta-cutlery-review-2026' },
  { id:'gh-vipertec',              name:'Viper Tec Inc.',           cat:'Lifestyle', lc:'007949091308006550', slug:'vipertec-tactical-knives-2026' },
  { id:'gh-bugatchi',              name:'Bugatchi',                 cat:'Lifestyle', lc:'007949094561006921', slug:'bugatchi-mens-fashion-2026' },
  { id:'gh-readygolf',             name:'ReadyGolf',                cat:'Lifestyle', lc:'007949135537007633', slug:'readygolf-guide-2026' },
  { id:'gh-incentrev',             name:'Incentrev',                cat:'Lifestyle', lc:'007949151790007794', slug:'incentrev-rewards-2026' },
];

// ── Affiliate URL builder
function affUrl(merchant, utm_campaign, utm_content) {
  return `https://www.linkconnector.com/ta.php?lc=${merchant.lc}&atid=${merchant.id}&utm_source=gh-generator&utm_medium=affiliate&utm_campaign=${utm_campaign}&utm_content=${utm_content}`;
}

// ── API call
function callApi(prompt, maxTokens = 8000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    });
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.content && parsed.content[0]) resolve(parsed.content[0].text);
          else reject(new Error('No content: ' + data.slice(0, 300)));
        } catch(e) { reject(new Error('Parse error: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function parseJson(text) {
  const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
  try { return JSON.parse(clean); } catch(e) {
    const match = clean.match(/[\[\{][\s\S]*[\]\}]/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Cannot parse JSON: ' + e.message);
  }
}

// ── Generator log helpers
function loadGenLog() {
  if (!fs.existsSync(GEN_LOG)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(GEN_LOG, 'utf8'));
    return Array.isArray(raw) ? Object.fromEntries(raw.map(e => [e.date, e])) : raw;
  } catch(e) { return {}; }
}

function saveGenLog(log) {
  fs.writeFileSync(GEN_LOG, JSON.stringify(log, null, 2), 'utf8');
}

// ── STATUS command
function cmdStatus() {
  console.log('\n📊 GLOBALCAMPAIGNHUB CONTENT STATUS');
  console.log('════════════════════════════════════');

  const files = {
    'post-topics.json':           'Post Topics',
    'keywords-1000.json':         'Keywords (1000)',
    'targetedkeys.js':            'Targeted Keywords (legacy)',
    'topic-generator-log.json':   'Topic Generator Log',
    'keyword-generator-log.json': 'Keyword Generator Log',
    'keyword-injector-log.json':  'Keyword Injector Log',
    'injector-log.json':          'Injector Log',
  };

  Object.entries(files).forEach(([file, label]) => {
    if (!fs.existsSync(file)) { console.log(`  ✗ ${label}: NOT FOUND`); return; }
    const kb = (fs.statSync(file).size / 1024).toFixed(1);

    if (file === 'post-topics.json') {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const total   = data.topics.length;
      const pending = data.topics.filter(t => !t.published).length;
      console.log(`  ✓ ${label}: ${total} total, ${pending} pending, ${total - pending} published`);
    } else if (file === 'keywords-1000.json') {
      const kws = JSON.parse(fs.readFileSync(file, 'utf8'));
      const langs = [...new Set(kws.map(k => k.lang).filter(Boolean))];
      console.log(`  ✓ ${label}: ${kws.length} keywords, ${langs.length} languages (${kb}KB)`);
    } else if (file === 'targetedkeys.js') {
      const content = fs.readFileSync(file, 'utf8');
      const count = (content.match(/keyword:/g) || []).length;
      console.log(`  ✓ ${label}: ${count} keywords (${kb}KB)`);
    } else if (file === 'injector-log.json') {
      try {
        const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
        const log = Array.isArray(raw) ? raw : Object.values(raw);
        const last = log[log.length - 1];
        console.log(`  ✓ ${label}: ${log.length} runs, last: ${last?.date || 'N/A'}`);
      } catch(e) { console.log(`  ✓ ${label}: ${kb}KB`); }
    } else {
      const log = loadGenLog();
      const dates = Object.keys(log).sort();
      const last = dates[dates.length - 1];
      const lastEntry = log[last] || {};
      console.log(`  ✓ ${label}: ${dates.length} days, last: ${last || 'N/A'}, generated: ${lastEntry.generated || 0}`);
    }
  });

  const blogFiles = ['blog.html','blog-zh.html','blog-zh-tw.html','blog-es.html','blog-fr.html','blog-de.html','blog-pt.html','blog-pt-br.html','blog-ja.html','blog-ko.html','blog-it.html','blog-nl.html','blog-pl.html','blog-hi.html','blog-ar.html','blog-ru.html','blog-tr.html','blog-id.html','blog-vi.html','blog-th.html'];
  const found = blogFiles.filter(f => fs.existsSync(f)).length;
  console.log(`  ✓ Blog Files: ${found}/20 language files present`);

  console.log('\n  Key Pages:');
  ['index.html','merchants.html','sitemap.xml','robots.txt','llms.txt'].forEach(f => {
    console.log(`  ${fs.existsSync(f) ? '✓' : '✗'} ${f}`);
  });

  console.log('\n  Scripts:');
  ['generate.js','inject.js','auto-topic-generator.js','auto-keyword-generator.js','keyword-injector.js'].forEach(f => {
    console.log(`  ${fs.existsSync(f) ? '✓' : '✗'} ${f}`);
  });

  console.log(`\n  Merchants registered: ${MERCHANTS.length}`);
  const cats = {};
  MERCHANTS.forEach(m => cats[m.cat] = (cats[m.cat]||0)+1);
  Object.entries(cats).forEach(([c, n]) => console.log(`    ${c}: ${n}`));
  console.log('════════════════════════════════════\n');
}

// ── TOPICS command
async function cmdTopics(n = 20) {
  console.log(`\n📝 Generating ${n} new post topics...`);

  if (!fs.existsSync('post-topics.json')) {
    console.error('✗ post-topics.json not found');
    return;
  }

  const data = JSON.parse(fs.readFileSync('post-topics.json', 'utf8'));
  // Safety: ensure meta exists
  data.meta = data.meta || {};
  const existingSlugs = data.topics.map(t => t.slug);
  const pending = data.topics.filter(t => !t.published).length;
  console.log(`  Current: ${data.topics.length} total, ${pending} pending`);

  // Pick least-covered merchants
  const coverage = {};
  MERCHANTS.forEach(m => coverage[m.id] = 0);
  data.topics.forEach(t => { if (coverage[t.merchant] !== undefined) coverage[t.merchant]++; });
  const targets = [...MERCHANTS]
    .sort((a, b) => coverage[a.id] - coverage[b.id])
    .slice(0, Math.min(n, 20));

  const merchantList = targets.map(m =>
    `- "${m.id}" | ${m.name} | ${m.cat} | lc:${m.lc} | slug:${m.slug}`
  ).join('\n');

  const existingSample = existingSlugs.slice(-20).join(', ');

  const prompt = `Generate exactly ${n} blog post topics for GlobalCampaignHub affiliate site.
Account: LinkConnector 007949. Tracking prefix: gh-

Target merchants (prioritize — they need more content):
${merchantList}

Existing slugs (do NOT duplicate): ${existingSample}

Rules:
- Genuine buyer guides, reviews, comparisons, how-tos
- Target real high-volume search keywords
- English content only in _en fields
- Unique slugs in kebab-case with year suffix e.g. nordvpn-review-2026
- Use EXACT merchant IDs and LC codes from the list above

Return ONLY a valid JSON array. No markdown. Start with [ end with ]

Each topic format:
{
  "slug": "unique-slug-2026",
  "merchant": "gh-merchantid",
  "lc": "007949xxxxxxxxx",
  "published": false,
  "title_en": "Full SEO Title",
  "category_en": "Category",
  "metaDesc_en": "155 char meta description",
  "keywords_en": "kw1, kw2, kw3, kw4, kw5",
  "intro_en": "2-3 sentence intro",
  "callout_en": "Key insight or tip",
  "h2a_en": "First H2 heading",
  "body1_en": "2-3 sentence body paragraph",
  "bullets_en": ["Point 1","Point 2","Point 3","Point 4","Point 5","Point 6"],
  "verdict_title_en": "Merchant — Short Verdict",
  "verdict_desc_en": "2-3 sentence verdict",
  "h2b_en": "Second H2 heading",
  "body2_en": "2-3 sentence paragraph",
  "cta_en": "CTA button text",
  "cta2_en": "Secondary CTA text",
  "faqs_en": [
    {"q":"Question 1?","a":"Answer 1."},
    {"q":"Question 2?","a":"Answer 2."},
    {"q":"Question 3?","a":"Answer 3."}
  ]
}`;

  const response = await callApi(prompt, 8000);
  const topics = parseJson(response);

  if (!Array.isArray(topics)) throw new Error('Response is not an array');

  const existing = new Set(existingSlugs);
  const valid = topics.filter(t => {
    if (!t.slug || !t.merchant || !t.title_en) return false;
    if (existing.has(t.slug)) { console.log(`  ⚠ Skip duplicate: ${t.slug}`); return false; }
    // Always enforce canonical LC from our verified registry
    const m = MERCHANTS.find(x => x.id === t.merchant);
    if (!m) { console.log(`  ⚠ Skip unknown merchant: ${t.merchant}`); return false; }
    t.lc = m.lc;
    t.published = false;
    existing.add(t.slug);
    return true;
  });

  data.topics.push(...valid);
  data.meta.total = data.topics.length;
  data.meta.last_updated = TODAY;
  fs.writeFileSync('post-topics.json', JSON.stringify(data, null, 2));

  // Write to generator log
  const log = loadGenLog();
  log[TODAY] = {
    date: TODAY,
    generated: valid.length,
    pending_after: data.topics.filter(t => !t.published).length,
    timestamp: new Date().toISOString(),
    merchants: MERCHANTS.length,
  };
  saveGenLog(log);

  console.log(`  ✓ Added ${valid.length} new topics`);
  console.log(`  Total: ${data.topics.length} topics, ${data.topics.filter(t=>!t.published).length} pending`);
}

// ── KEYWORDS command
async function cmdKeywords(n = 50) {
  console.log(`\n🔍 Generating ${n} new keywords in 20 languages...`);

  let existingKeywords = [];
  if (fs.existsSync('keywords-1000.json')) {
    existingKeywords = JSON.parse(fs.readFileSync('keywords-1000.json', 'utf8')).map(k => k.keyword);
  } else if (fs.existsSync('targetedkeys.js')) {
    existingKeywords = (fs.readFileSync('targetedkeys.js','utf8').match(/keyword: '([^']+)'/g) || [])
      .map(m => m.replace("keyword: '","").replace("'",""));
  }

  console.log(`  Existing: ${existingKeywords.length} keywords`);

  const merchantList = MERCHANTS.map(m =>
    `${m.id} (lc:${m.lc}) — ${m.name} — ${m.cat}`
  ).join('\n');

  const sample = existingKeywords.slice(-15).join(', ');

  const prompt = `Generate exactly ${n} targeted search keywords for GlobalCampaignHub.
Account: LinkConnector 007949. All merchants use gh- tracking prefix.

Rules:
- Minimum 40% non-English keywords IN their native language (not translated English)
- Languages: en, es, fr, de, zh, zh-tw, ja, ko, pt, pt-br, hi, it, nl, pl, ar, ru, tr, id, vi, th
- High volume (100K+ monthly searches preferred)
- Must use EXACT merchant IDs and LC codes from list below
- Do NOT reuse: ${sample}

All merchants (use ONLY these exact IDs and LC codes):
${merchantList}

Return ONLY a valid JSON array. No markdown.

Format:
[
  { "keyword": "best vpn 2026", "volume": 2100000, "merchant": "gh-nordvpn", "lc": "007949079282005891", "cat": "Software", "slug": "nordvpn-review-2026", "lang": "en" },
  { "keyword": "mejor vpn 2026", "volume": 890000, "merchant": "gh-nordvpn", "lc": "007949079282005891", "cat": "Software", "slug": "nordvpn-review-2026", "lang": "es" }
]`;

  const response = await callApi(prompt, 8000);
  const keywords = parseJson(response);

  if (!Array.isArray(keywords)) throw new Error('Response is not an array');

  const existingSet = new Set(existingKeywords.map(k => k.toLowerCase()));
  const valid = keywords.filter(k => {
    if (!k.keyword || !k.merchant || !k.volume) return false;
    if (existingSet.has(k.keyword.toLowerCase())) return false;
    existingSet.add(k.keyword.toLowerCase());
    // Enforce canonical LC
    const m = MERCHANTS.find(x => x.id === k.merchant);
    if (m) { k.lc = m.lc; k.cat = m.cat; if (!k.slug) k.slug = m.slug; }
    if (!k.lang) k.lang = 'en';
    return true;
  });

  valid.sort((a, b) => b.volume - a.volume);

  if (fs.existsSync('keywords-1000.json')) {
    const existing = JSON.parse(fs.readFileSync('keywords-1000.json', 'utf8'));
    const updated = [...existing, ...valid].sort((a,b) => (b.volume||0)-(a.volume||0));
    fs.writeFileSync('keywords-1000.json', JSON.stringify(updated, null, 2));
    console.log(`  ✓ keywords-1000.json: ${existing.length} → ${updated.length} keywords`);
  } else if (fs.existsSync('targetedkeys.js')) {
    let content = fs.readFileSync('targetedkeys.js', 'utf8');
    const newEntries = valid.map(k =>
      `  { keyword: ${JSON.stringify(k.keyword)}, volume: ${k.volume}, merchant: ${JSON.stringify(k.merchant)}, lc: ${JSON.stringify(k.lc)}, cat: ${JSON.stringify(k.cat)}, slug: ${JSON.stringify(k.slug)}, lang: ${JSON.stringify(k.lang)} },`
    ).join('\n');
    const marker = content.lastIndexOf('];');
    if (marker !== -1) {
      content = content.slice(0, marker) + '\n  // Generated ' + TODAY + '\n' + newEntries + '\n' + content.slice(marker);
      fs.writeFileSync('targetedkeys.js', content);
    }
  }

  const langBreakdown = {};
  valid.forEach(k => { langBreakdown[k.lang] = (langBreakdown[k.lang]||0)+1; });
  console.log(`  ✓ Added ${valid.length} keywords`);
  console.log(`  Languages: ${Object.entries(langBreakdown).sort((a,b)=>b[1]-a[1]).map(([l,n])=>`${l}:${n}`).join(', ')}`);
}

// ── BLOG command
async function cmdBlog(slug) {
  if (!slug) { console.error('✗ Provide --slug=your-slug'); return; }
  console.log(`\n📄 Generating full blog post for: ${slug}`);

  if (!fs.existsSync('post-topics.json')) { console.error('✗ post-topics.json not found'); return; }

  const data = JSON.parse(fs.readFileSync('post-topics.json', 'utf8'));
  const topic = data.topics.find(t => t.slug === slug);

  if (!topic) {
    console.error(`✗ Topic "${slug}" not found in post-topics.json`);
    console.log('  Available unpublished slugs:');
    data.topics.filter(t=>!t.published).slice(0,10).forEach(t => console.log(`    - ${t.slug}`));
    return;
  }

  const merchant = MERCHANTS.find(m => m.id === topic.merchant);
  if (!merchant) { console.error(`✗ Merchant ${topic.merchant} not found`); return; }

  const aUrl = affUrl(merchant, slug, 'blog-cta');

  const prompt = `Generate a complete, high-quality affiliate blog post for GlobalCampaignHub.

Merchant: ${merchant.name} (${merchant.cat})
Affiliate URL: ${aUrl}
Topic: ${topic.title_en}
Keywords: ${topic.keywords_en}
LC Code: ${merchant.lc}
Tracking ID: ${merchant.id}

Write a full 800-1200 word buyer guide in English. Include:
- Compelling introduction
- 2-3 H2 sections with substantial body text
- Feature comparison or bullet points
- Honest verdict
- 3 FAQ questions and answers
- Natural affiliate link placement (use the exact URL above)

Return the content as a JSON object (no markdown):
{
  "intro_en": "...",
  "callout_en": "...",
  "h2a_en": "...",
  "body1_en": "...",
  "bullets_en": ["...", "...", "...", "...", "...", "..."],
  "verdict_title_en": "...",
  "verdict_desc_en": "...",
  "h2b_en": "...",
  "body2_en": "...",
  "cta_en": "...",
  "cta2_en": "...",
  "faqs_en": [{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."}]
}`;

  const response = await callApi(prompt, 4000);
  const content = parseJson(response);

  Object.assign(topic, content);
  topic.lc = merchant.lc; // always enforce canonical LC
  data.meta = data.meta || {};
  fs.writeFileSync('post-topics.json', JSON.stringify(data, null, 2));
  console.log(`  ✓ Blog content generated for: ${slug}`);
  console.log(`  Merchant: ${merchant.name} | LC: ${merchant.lc}`);
  console.log(`  Run: node inject.js`);
}

// ── CAMPAIGN command
async function cmdCampaign(kw) {
  if (!kw) { console.error('✗ Provide --kw="your keyword"'); return; }
  console.log(`\n🎯 Generating campaign content for: "${kw}"`);

  const kwLower = kw.toLowerCase();
  let merchant = MERCHANTS.find(m =>
    kwLower.includes(m.name.toLowerCase().split(' ')[0]) ||
    kwLower.includes(m.id.replace('gh-',''))
  ) || MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];

  console.log(`  Merchant: ${merchant.name} | LC: ${merchant.lc}`);
  const aUrl = affUrl(merchant, kw.replace(/\s+/g,'-').toLowerCase(), 'campaign-cta');

  const prompt = `Generate campaign page content for GlobalCampaignHub.
Keyword: "${kw}"
Merchant: ${merchant.name} (${merchant.cat})
Affiliate URL: ${aUrl}
LC Code: ${merchant.lc} | Tracking: ${merchant.id}

Return JSON (no markdown):
{
  "title": "Page title targeting the keyword",
  "metaDesc": "155 char meta description",
  "heroSub": "2 sentence hero subheading",
  "proofPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "useCases": [
    {"tab": "Tab label", "h": "Heading", "p": "2 sentence description"},
    {"tab": "Tab label", "h": "Heading", "p": "2 sentence description"},
    {"tab": "Tab label", "h": "Heading", "p": "2 sentence description"}
  ],
  "faqs": [
    {"q": "Question?", "a": "Answer."},
    {"q": "Question?", "a": "Answer."},
    {"q": "Question?", "a": "Answer."}
  ],
  "ctaText": "Primary CTA button text",
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5"]
}`;

  const response = await callApi(prompt, 2000);
  const content = parseJson(response);

  const outputFile = `generated-campaign-${kw.replace(/\s+/g,'-').toLowerCase()}.json`;
  fs.writeFileSync(outputFile, JSON.stringify({
    keyword: kw, merchant: merchant.id, lc: merchant.lc, affUrl: aUrl, content
  }, null, 2));
  console.log(`  ✓ Saved to: ${outputFile}`);
}

// ── ALL command
async function cmdAll() {
  console.log('\n🚀 Running all generators...\n');
  await cmdTopics(20);
  await cmdKeywords(50);
  console.log('\n✅ All generators complete.');
}

// ── Parse args and run
async function main() {
  const args = process.argv.slice(2);
  const cmd  = args[0] || 'status';
  const opts = {};
  args.slice(1).forEach(arg => {
    const [k, v] = arg.replace(/^--/,'').split('=');
    opts[k] = v || true;
  });

  if (!API_KEY && cmd !== 'status') {
    console.error('✗ ANTHROPIC_API_KEY not set.\n  export ANTHROPIC_API_KEY=your_key');
    process.exit(1);
  }

  console.log(`\n🌍 GLOBALCAMPAIGNHUB GENERATOR v1.2 — ${cmd.toUpperCase()}`);
  console.log(`Account: LinkConnector 007949 | Date: ${TODAY} | Merchants: ${MERCHANTS.length}`);

  try {
    switch(cmd) {
      case 'status':   cmdStatus(); break;
      case 'topics':   await cmdTopics(parseInt(opts.n) || 20); break;
      case 'keywords': await cmdKeywords(parseInt(opts.n) || 50); break;
      case 'blog':     await cmdBlog(opts.slug); break;
      case 'campaign': await cmdCampaign(opts.kw); break;
      case 'all':      await cmdAll(); break;
      default:
        console.log(`Unknown command: ${cmd}`);
        console.log('Commands: status, topics, keywords, blog, campaign, all');
    }
  } catch(err) {
    console.error('\n✗ Error:', err.message);
    process.exit(1);
  }
}

main();
