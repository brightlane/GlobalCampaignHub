#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
//  GLOBALCAMPAIGNHUB AUTO-KEYWORD-GENERATOR v1.0
//  Run: node auto-keyword-generator.js
//
//  Generates high-volume targeted keywords in all 20 languages
//  for all 68 merchants. Feeds targetedkeys.js and campaign-page.html
//
//  Target: 1M+ keyword variations across all languages
//  Account: LinkConnector 007949 | Tracking: gh- atid prefix
// ═══════════════════════════════════════════════════════════════════════

const fs    = require('fs');
const https = require('https');

const KEYWORDS_FILE  = 'targetedkeys.js';
const CAMPAIGN_FILE  = 'campaign-page.html';
const LOG_FILE       = 'keyword-generator-log.json';
const MODEL          = 'claude-sonnet-4-20250514';
const API_KEY        = process.env.ANTHROPIC_API_KEY;
const MIN_KEYWORDS   = 500;   // refill when below this
const BATCH_SIZE     = 50;    // generate 50 new keywords per run
const TODAY          = new Date().toISOString().slice(0, 10);
const BASE           = 'https://brightlane.github.io/GlobalCampaignHub';

// ── All 20 languages with native keyword translations
const LANGUAGES = [
  { code: 'en',    name: 'English',              searchEngine: 'Google' },
  { code: 'zh',    name: 'Chinese Simplified',   searchEngine: 'Baidu/Google' },
  { code: 'zh-tw', name: 'Chinese Traditional',  searchEngine: 'Google/Yahoo TW' },
  { code: 'es',    name: 'Spanish',              searchEngine: 'Google' },
  { code: 'fr',    name: 'French',               searchEngine: 'Google' },
  { code: 'de',    name: 'German',               searchEngine: 'Google' },
  { code: 'pt',    name: 'Portuguese',           searchEngine: 'Google' },
  { code: 'pt-br', name: 'Portuguese Brazil',    searchEngine: 'Google' },
  { code: 'ja',    name: 'Japanese',             searchEngine: 'Google/Yahoo JP' },
  { code: 'ko',    name: 'Korean',               searchEngine: 'Naver/Google' },
  { code: 'it',    name: 'Italian',              searchEngine: 'Google' },
  { code: 'nl',    name: 'Dutch',                searchEngine: 'Google' },
  { code: 'pl',    name: 'Polish',               searchEngine: 'Google' },
  { code: 'hi',    name: 'Hindi',                searchEngine: 'Google' },
  { code: 'ar',    name: 'Arabic',               searchEngine: 'Google' },
  { code: 'ru',    name: 'Russian',              searchEngine: 'Yandex/Google' },
  { code: 'tr',    name: 'Turkish',              searchEngine: 'Google' },
  { code: 'id',    name: 'Indonesian',           searchEngine: 'Google' },
  { code: 'vi',    name: 'Vietnamese',           searchEngine: 'Google' },
  { code: 'th',    name: 'Thai',                 searchEngine: 'Google' },
];

// ── All 68 merchants
const MERCHANTS = [
  { id: 'gh-efile',               name: 'E-file.com',              cat: 'Tax',        lc: '007949021469002241' },
  { id: 'gh-etax',                name: 'E TAX LLC',               cat: 'Tax',        lc: '007949113645003507' },
  { id: 'gh-taxextension',        name: 'TaxExtension.com',        cat: 'Tax',        lc: '007949033342002305' },
  { id: 'gh-eztaxreturn',         name: 'ezTaxReturn.com',         cat: 'Tax',        lc: '007949053344004952' },
  { id: 'gh-nordvpn',             name: 'NordVPN',                 cat: 'Software',   lc: '007949143344006843' },
  { id: 'gh-depositphotos',       name: 'Depositphotos',           cat: 'Software',   lc: '007949063344003921' },
  { id: 'gh-filmora',             name: 'Wondershare Filmora',     cat: 'Software',   lc: '007949165260004532' },
  { id: 'gh-pdfelement',          name: 'Wondershare PDFelement',  cat: 'Software',   lc: '007949165372004532' },
  { id: 'gh-edraw',               name: 'Edraw Mind/Max',          cat: 'Software',   lc: '007949165246006886' },
  { id: 'gh-sidify',              name: 'Sidify',                  cat: 'Software',   lc: '007949163344007882' },
  { id: 'gh-movavi',              name: 'Movavi Software',         cat: 'Software',   lc: '007949153344007119' },
  { id: 'gh-jalbum',              name: 'jAlbum',                  cat: 'Software',   lc: '007949143344006442' },
  { id: 'gh-updf',                name: 'UPDF',                    cat: 'Software',   lc: '007949163344008112' },
  { id: 'gh-itoolab',             name: 'iToolab',                 cat: 'Software',   lc: '007949163344008441' },
  { id: 'gh-tenorshare',          name: 'Tenorshare',              cat: 'Software',   lc: '007949163344008992' },
  { id: 'gh-appypie',             name: 'Appy Pie',                cat: 'Software',   lc: '007949153344007442' },
  { id: 'gh-individualsoftware',  name: 'Individual Software',     cat: 'Software',   lc: '007949133344005882' },
  { id: 'gh-youware',             name: 'YouWare',                 cat: 'Software',   lc: '007949163344008118' },
  { id: 'gh-renoise',             name: 'Renoise',                 cat: 'Software',   lc: '007949143344006551' },
  { id: 'gh-picador',             name: 'Picador Multimedia',      cat: 'Software',   lc: '007949133344006228' },
  { id: 'gh-boardvitals',         name: 'BoardVitals',             cat: 'Education',  lc: '007949114675005824' },
  { id: 'gh-surgent',             name: 'Surgent CPA',             cat: 'Education',  lc: '007949123344006122' },
  { id: 'gh-hrcp',                name: 'HRCP',                    cat: 'Education',  lc: '007949093344005114' },
  { id: 'gh-oakstone',            name: 'Oakstone Medical',        cat: 'Education',  lc: '007949103344005432' },
  { id: 'gh-securitiesinstitute', name: 'Securities Institute',    cat: 'Education',  lc: '007949113344005987' },
  { id: 'gh-illumeo',             name: 'Illumeo',                 cat: 'Education',  lc: '007949143344006221' },
  { id: 'gh-wolterskluwer',       name: 'Wolters Kluwer LWW',      cat: 'Education',  lc: '007949165370003224' },
  { id: 'gh-learntasticcpr',      name: 'LearnTastic CPR',         cat: 'Education',  lc: '007949143344006112' },
  { id: 'gh-learntasticahca',     name: 'LearnTastic AHCA',        cat: 'Education',  lc: '007949143344006113' },
  { id: 'gh-pmtraining',          name: 'PM Training',             cat: 'Education',  lc: '007949143344006992' },
  { id: 'gh-canadapetcare',       name: 'CanadaPetCare',           cat: 'Pet Care',   lc: '007949083344004721' },
  { id: 'gh-bestvetcare',         name: 'BestVetCare',             cat: 'Pet Care',   lc: '007949093344004992' },
  { id: 'gh-budgetpetcare',       name: 'BudgetPetCare',           cat: 'Pet Care',   lc: '007949103344005118' },
  { id: 'gh-budgetpetworld',      name: 'BudgetPetWorld',          cat: 'Pet Care',   lc: '007949113344005224' },
  { id: 'gh-discountpetcare',     name: 'DiscountPetCare',         cat: 'Pet Care',   lc: '007949123344005441' },
  { id: 'gh-nursejamie',          name: 'Nurse Jamie',             cat: 'Health',     lc: '007949153344007112' },
  { id: 'gh-personalabs',         name: 'Personalabs',             cat: 'Health',     lc: '007949133344005442' },
  { id: 'gh-ayurvedaexperience',  name: 'Ayurveda Experience',     cat: 'Health',     lc: '007949163344008221' },
  { id: 'gh-maxpeedingrodsus',    name: 'Maxpeedingrods US',       cat: 'Auto',       lc: '007949133344006421' },
  { id: 'gh-maxpeedingrodsau',    name: 'Maxpeedingrods AU',       cat: 'Auto',       lc: '007949143344006554' },
  { id: 'gh-lafuente',            name: 'La Fuente Imports',       cat: 'Auto',       lc: '007949083344003992' },
  { id: 'gh-buildasign',          name: 'BuildASign',              cat: 'Print',      lc: '007949043344001995' },
  { id: 'gh-bannersonthecheap',   name: 'BannersOnTheCheap',       cat: 'Print',      lc: '007949073344003661' },
  { id: 'gh-canvasonthecheap',    name: 'CanvasOnTheCheap',        cat: 'Print',      lc: '007949073344003662' },
  { id: 'gh-easycanvasprints',    name: 'Easy Canvas Prints',      cat: 'Print',      lc: '007949063344003112' },
  { id: 'gh-etchingexpressions',  name: 'Etching Expressions',     cat: 'Print',      lc: '007949083344004332' },
  { id: 'gh-ryonet',              name: 'Ryonet',                  cat: 'Print',      lc: '007949084633004512' },
  { id: 'gh-trademarkhardware',   name: 'Trademark Hardware',      cat: 'Hardware',   lc: '007949123344005912' },
  { id: 'gh-trademarksoundproofing', name: 'Trademark Soundproofing', cat: 'Hardware', lc: '007949133344006118' },
  { id: 'gh-warehouse115',        name: 'Warehouse 115',           cat: 'Hardware',   lc: '007949163344007442' },
  { id: 'gh-fieldtex',            name: 'Fieldtex Products',       cat: 'Hardware',   lc: '007949123344005118' },
  { id: 'gh-productsonthego',     name: 'Products On The Go',      cat: 'Hardware',   lc: '007949113344004882' },
  { id: 'gh-halloweencostumes',   name: 'HalloweenCostumes.com',   cat: 'Lifestyle',  lc: '007949053344002874' },
  { id: 'gh-graeters',            name: "Graeter's Ice Cream",     cat: 'Lifestyle',  lc: '007949073344004112' },
  { id: 'gh-thechessstore',       name: 'The Chess Store',         cat: 'Lifestyle',  lc: '007949103344005112' },
  { id: 'gh-museumreplicas',      name: 'MuseumReplicas.com',      cat: 'Lifestyle',  lc: '007949113344005442' },
  { id: 'gh-atlantacutlery',      name: 'Atlanta Cutlery',         cat: 'Lifestyle',  lc: '007949123344005771' },
  { id: 'gh-vipertec',            name: 'Viper Tec',               cat: 'Lifestyle',  lc: '007949133344006224' },
  { id: 'gh-combatflipflops',     name: 'Combat Flip Flops',       cat: 'Lifestyle',  lc: '007949143344006881' },
  { id: 'gh-camanoislandcoffee',  name: 'Camano Island Coffee',    cat: 'Lifestyle',  lc: '007949053344002441' },
  { id: 'gh-readygolf',           name: 'ReadyGolf',               cat: 'Lifestyle',  lc: '007949103344004551' },
  { id: 'gh-gunsinternational',   name: 'GunsInternational',       cat: 'Lifestyle',  lc: '007949093344004221' },
  { id: 'gh-carmellimo',          name: 'Carmel Car & Limo',       cat: 'Lifestyle',  lc: '007949053344002881' },
  { id: 'gh-bugatchi',            name: 'Bugatchi',                cat: 'Lifestyle',  lc: '007949153344007662' },
  { id: 'gh-surveyjunkie',        name: 'Survey Junkie',           cat: 'Lifestyle',  lc: '007949033344001882' },
  { id: 'gh-tastyribbon',         name: 'Tasty Ribbon',            cat: 'Lifestyle',  lc: '007949153344007881' },
  { id: 'gh-bgmgirl',             name: 'BGM Girl',                cat: 'Lifestyle',  lc: '007949153344007992' },
  { id: 'gh-incentrev',           name: 'Incentrev',               cat: 'Lifestyle',  lc: '007949123344005991' },
];

// ── Read current keyword count from targetedkeys.js
function getCurrentKeywordCount() {
  if (!fs.existsSync(KEYWORDS_FILE)) return 0;
  const content = fs.readFileSync(KEYWORDS_FILE, 'utf8');
  const matches = content.match(/\{ keyword:/g);
  return matches ? matches.length : 0;
}

// ── Read existing keyword slugs to avoid duplicates
function getExistingKeywords() {
  if (!fs.existsSync(KEYWORDS_FILE)) return [];
  const content = fs.readFileSync(KEYWORDS_FILE, 'utf8');
  const matches = content.match(/keyword: '([^']+)'/g) || [];
  return matches.map(m => m.replace("keyword: '", '').replace("'", ''));
}

// ── Call Claude API
function callApi(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
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
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.content && parsed.content[0]) resolve(parsed.content[0].text);
          else reject(new Error('No content: ' + data.slice(0, 200)));
        } catch(e) { reject(new Error('Parse error: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Generate new keywords via Claude API
async function generateKeywords(existingKeywords, count) {
  // Pick merchants with least coverage
  const merchantUsage = {};
  MERCHANTS.forEach(m => merchantUsage[m.id] = 0);
  existingKeywords.forEach(kw => {
    // rough merchant detection from keyword text
    MERCHANTS.forEach(m => {
      if (kw.includes(m.name.toLowerCase().split(' ')[0].toLowerCase())) {
        merchantUsage[m.id]++;
      }
    });
  });

  // Prioritize merchants with less coverage
  const targetMerchants = [...MERCHANTS]
    .sort((a, b) => merchantUsage[a.id] - merchantUsage[b.id])
    .slice(0, 20);

  const merchantList = targetMerchants.map(m =>
    `  - id: "${m.id}" | name: "${m.name}" | category: "${m.cat}" | lc: "${m.lc}"`
  ).join('\n');

  const langList = LANGUAGES.map(l =>
    `  - ${l.code}: ${l.name} (${l.searchEngine})`
  ).join('\n');

  const existingSample = existingKeywords.slice(-20).join(', ');

  const prompt = `You are generating high-volume SEO keywords for GlobalCampaignHub, an affiliate marketing site with 68 verified merchants.

TASK: Generate exactly ${count} new keyword entries for the TARGETED_KEYWORDS array in targetedkeys.js.

TARGET MERCHANTS (prioritize these — they need more keywords):
${merchantList}

TARGET LANGUAGES (generate keywords in multiple languages — not just English):
${langList}

EXISTING KEYWORDS (do NOT duplicate these): ${existingSample}

RULES:
1. Generate keywords in MULTIPLE languages — at least 40% non-English
2. For non-English keywords, write the keyword IN that language (e.g., Spanish: "mejor editor de video 2026", Japanese: "最高のVPN 2026")
3. Each keyword must target real search intent with commercial value
4. Volume estimates must be realistic for that language market
5. Slug must be URL-safe kebab-case in English (for the URL)
6. blogSlug must match an existing blog post slug or use a logical new one
7. Prioritize HIGH VOLUME keywords (100K+ monthly searches)

Return ONLY a valid JavaScript array — no markdown, no explanation, no code fences. Start with [ and end with ]

Format each entry EXACTLY like this:
{ keyword: 'best vpn 2026', volume: 2100000, merchant: 'gh-nordvpn', lc: '007949143344006843', cat: 'Software', blogSlug: 'nordvpn-review-2026', lang: 'en' }

For non-English example:
{ keyword: 'mejor vpn 2026', volume: 890000, merchant: 'gh-nordvpn', lc: '007949143344006843', cat: 'Software', blogSlug: 'nordvpn-review-2026', lang: 'es' }

Generate all ${count} entries now. Remember: minimum 40% must be non-English keywords in their native languages.`;

  const response = await callApi(prompt);

  let entries;
  try {
    const clean = response.replace(/```javascript\n?/g, '').replace(/```js\n?/g, '').replace(/```\n?/g, '').trim();
    // Extract array
    const match = clean.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No array found in response');
    entries = JSON.parse(match[0]);
  } catch(e) {
    throw new Error('Failed to parse API response: ' + e.message);
  }

  if (!Array.isArray(entries)) throw new Error('Response is not an array');

  // Validate and deduplicate
  const existingSet = new Set(existingKeywords.map(k => k.toLowerCase()));
  return entries.filter(e => {
    if (!e.keyword || !e.merchant || !e.lc || !e.volume) return false;
    if (existingSet.has(e.keyword.toLowerCase())) return false;
    existingSet.add(e.keyword.toLowerCase());
    // Ensure lang field exists
    if (!e.lang) e.lang = 'en';
    return true;
  });
}

// ── Append new keywords to targetedkeys.js
function appendKeywords(newKeywords) {
  if (!fs.existsSync(KEYWORDS_FILE)) {
    console.error('✗ targetedkeys.js not found');
    return 0;
  }

  let content = fs.readFileSync(KEYWORDS_FILE, 'utf8');

  // Build new entries
  const newEntries = newKeywords.map(k => {
    const lang = k.lang || 'en';
    const blogFile = lang === 'en' ? 'blog.html' : `blog-${lang}.html`;
    return `  { keyword: ${JSON.stringify(k.keyword)}, volume: ${k.volume}, merchant: ${JSON.stringify(k.merchant)}, lc: ${JSON.stringify(k.lc)}, cat: ${JSON.stringify(k.cat)}, blogSlug: ${JSON.stringify(k.blogSlug || k.merchant + '-review-2026')}, lang: ${JSON.stringify(lang)} },`;
  }).join('\n');

  // Inject before the closing ];
  const marker = '];';
  const insertAt = content.lastIndexOf(marker);
  if (insertAt === -1) {
    console.error('✗ Could not find closing ]; in targetedkeys.js');
    return 0;
  }

  const updated = content.slice(0, insertAt) +
    '\n  // ── AUTO-GENERATED ' + TODAY + ' ──\n' +
    newEntries + '\n' +
    content.slice(insertAt);

  fs.writeFileSync(KEYWORDS_FILE, updated, 'utf8');
  return newKeywords.length;
}

// ── Update campaign-page.html with new keyword entries
function updateCampaignPage(newKeywords) {
  if (!fs.existsSync(CAMPAIGN_FILE)) {
    console.log('  ⚠ campaign-page.html not found — skipping');
    return;
  }

  let html = fs.readFileSync(CAMPAIGN_FILE, 'utf8');

  // Build new ALL_KEYWORDS entries
  const newEntries = newKeywords
    .filter(k => k.lang === 'en' || !k.lang) // Only add English to campaign page
    .map(k => {
      const merchant = MERCHANTS.find(m => m.id === k.merchant);
      const name = merchant ? merchant.name : k.merchant;
      return `  { kw: ${JSON.stringify(k.keyword.replace(/\s+/g,'-').toLowerCase())}, title: ${JSON.stringify(k.keyword.replace(/\b\w/g, c => c.toUpperCase()))}, merchant: ${JSON.stringify(name)}, cat: ${JSON.stringify(k.cat)}, lc: ${JSON.stringify(k.lc)}, atid: ${JSON.stringify(k.merchant)}, volume: ${JSON.stringify(formatVolume(k.volume))}, blogSlug: ${JSON.stringify(k.blogSlug || k.merchant + '-review-2026')}, desc: ${JSON.stringify(k.keyword.replace(/\b\w/g, c => c.toUpperCase()) + ' — verified deal at GlobalCampaignHub.')} },`;
    }).join('\n');

  if (!newEntries) return;

  // Inject before closing of ALL_KEYWORDS array
  const marker = '];  // end ALL_KEYWORDS';
  if (html.includes(marker)) {
    html = html.replace(marker, '\n  // AUTO-GENERATED ' + TODAY + '\n' + newEntries + '\n' + marker);
  } else {
    // Try to find the array end another way
    const altMarker = '// ── Init';
    const idx = html.indexOf(altMarker);
    if (idx !== -1) {
      html = html.slice(0, idx) + '// AUTO-GENERATED ' + TODAY + '\n' + newEntries + '\n\n' + html.slice(idx);
    }
  }

  fs.writeFileSync(CAMPAIGN_FILE, html, 'utf8');
  console.log(`  ✓ campaign-page.html updated with ${newEntries.split('\n').length} new English keywords`);
}

function formatVolume(vol) {
  if (vol >= 1000000) return (vol/1000000).toFixed(1) + 'M';
  if (vol >= 1000) return Math.round(vol/1000) + 'K';
  return String(vol);
}

function logRun(generated, total, langBreakdown) {
  let log = [];
  if (fs.existsSync(LOG_FILE)) {
    try { log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch(e) {}
  }
  log.push({
    date: TODAY,
    generated,
    total_after: total,
    lang_breakdown: langBreakdown
  });
  if (log.length > 60) log = log.slice(-60);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8');
}

async function main() {
  console.log('\n🌍 GLOBALCAMPAIGNHUB AUTO-KEYWORD-GENERATOR v1.0');
  console.log('══════════════════════════════════════════════════');
  console.log(`Account: LinkConnector 007949 | Date: ${TODAY}`);
  console.log(`Target: 1M+ keyword variations across 20 languages\n`);

  if (!API_KEY) {
    console.log('⚠ ANTHROPIC_API_KEY not set — skipping keyword generation');
    process.exit(0);
  }

  const currentCount = getCurrentKeywordCount();
  console.log(`Current keyword count: ${currentCount.toLocaleString()}`);

  if (currentCount >= MIN_KEYWORDS) {
    console.log(`✓ Keyword bank healthy (${currentCount} >= ${MIN_KEYWORDS}) — generating anyway to grow toward 1M`);
  } else {
    console.log(`⚡ Keyword bank low — generating ${BATCH_SIZE} new keywords`);
  }

  const existingKeywords = getExistingKeywords();
  console.log(`Existing unique keywords: ${existingKeywords.length}`);
  console.log(`Generating ${BATCH_SIZE} new keywords across 20 languages...\n`);

  try {
    const newKeywords = await generateKeywords(existingKeywords, BATCH_SIZE);
    console.log(`✓ Generated ${newKeywords.length} valid new keywords`);

    // Language breakdown
    const langBreakdown = {};
    newKeywords.forEach(k => {
      const lang = k.lang || 'en';
      langBreakdown[lang] = (langBreakdown[lang] || 0) + 1;
    });
    console.log('\nLanguage breakdown:');
    Object.entries(langBreakdown).sort((a,b) => b[1]-a[1]).forEach(([lang, count]) => {
      const langName = LANGUAGES.find(l => l.code === lang)?.name || lang;
      console.log(`  ${langName} (${lang}): ${count}`);
    });

    // Sort by volume descending before appending
    newKeywords.sort((a, b) => b.volume - a.volume);

    console.log('\nAppending to targetedkeys.js...');
    const appended = appendKeywords(newKeywords);
    console.log(`  ✓ ${appended} keywords added to targetedkeys.js`);

    console.log('Updating campaign-page.html...');
    updateCampaignPage(newKeywords);

    const newTotal = getCurrentKeywordCount();
    logRun(newKeywords.length, newTotal, langBreakdown);

    console.log(`\n✅ Done!`);
    console.log(`  Keywords added: ${newKeywords.length}`);
    console.log(`  Total keywords: ${newTotal.toLocaleString()}`);
    console.log(`  Non-English: ${newKeywords.filter(k => k.lang && k.lang !== 'en').length} / ${newKeywords.length}`);
    console.log(`  Top new keyword: "${newKeywords[0]?.keyword}" — ${formatVolume(newKeywords[0]?.volume)}/mo`);
    console.log('══════════════════════════════════════════════════\n');

  } catch(err) {
    console.error('✗ Keyword generation failed:', err.message);
    process.exit(1);
  }
}

main();
